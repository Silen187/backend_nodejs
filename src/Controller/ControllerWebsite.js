const { query } = require('express');
const connectDB = require('../Config/Connect');
// Lớp controller
class ControllerWebsite {

// Hàm getData
    async getID(req, res) {
            try {

                const connection = await new Promise((resolve, reject) => {
                    // Gọi phương thức getConnection từ connectDB để lấy một kết nối từ pool kết nối
                    connectDB.getConnection((err, connection) => {
                        if (err) {
                            console.error('Error getting connection from pool:', err);
                            reject(err);
                        } else {
                            resolve(connection);
                        }
                    });
                });
              const id = req.query.id; // Lấy ID từ query parameters
          
              const query = `
                SELECT Web, Dim_NganhCon.NganhCon, Link, TenCV, CongTy, 
                       Dim_TinhThanh.TinhThanh AS TinhThanh, Dim_LoaiHinh.LoaiHinh AS LoaiHinh, 
                       HanNopCVDate AS HanNopCV, Dim_KinhNghiem.KinhNghiem AS KinhNghiem, 
                       LuongETL AS Luong, Image, ID, MoTa, YeuCau, PhucLoi, 
                       Dim_CapBac.CapBac AS CapBac, LuongTB, Dim_KhoangLuong.KhoangLuong AS KhoangLuong, 
                       SoLuong 
                FROM ThongTinTuyenDung.Data_Lake
                LEFT JOIN Dim_TinhThanh ON Data_Lake.ID_TinhThanh = Dim_TinhThanh.ID_TinhThanh
                LEFT JOIN Dim_LoaiHinh ON Data_Lake.ID_LoaiHinh = Dim_LoaiHinh.ID_LoaiHinh
                LEFT JOIN Dim_KinhNghiem ON Data_Lake.ID_KinhNghiem = Dim_KinhNghiem.ID_KinhNghiem
                LEFT JOIN Dim_CapBac ON Data_Lake.ID_CapBac = Dim_CapBac.ID_CapBac
                LEFT JOIN Dim_NganhCon ON Data_Lake.ID_NganhCon = Dim_NganhCon.ID_NganhCon
                LEFT JOIN Dim_KhoangLuong ON Data_Lake.ID_KhoangLuong = Dim_KhoangLuong.KhoangLuong_ID
                WHERE ID = '${id}';
              `;
                
              const rows = await new Promise((resolve, reject) => {
                connection.query(query, (err, rows) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
                
            });
            connection.release();
          
              if (rows.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy công việc' });
              }
          
              const jobDetails = rows[0]; // Lấy đối tượng chi tiết công việc
              // Xử lý ngày tháng:
              jobDetails.HanNopCV = jobDetails.HanNopCV ? jobDetails.HanNopCV.toISOString().slice(0, 10) : null;
              res.status(200).json({"results": jobDetails, "id": id});
            } catch (error) {
              console.error('Lỗi tìm kiếm:', error);
              res.status(500).json({ error: 'Lỗi server' });
            }
          }
    // Hàm search job
    async SearchJobs(req, res) {
        try {
            const connection = await new Promise((resolve, reject) => {
                // Gọi phương thức getConnection từ connectDB để lấy một kết nối từ pool kết nối
                connectDB.getConnection((err, connection) => {
                    if (err) {
                        console.error('Error getting connection from pool:', err);
                        reject(err);
                    } else {
                        resolve(connection);
                    }
                });
            });
          const keyword = req.query.valueSearch || '';
          const words = keyword.split(' ');
      
          // Tạo danh sách subphrases dựa trên số lượng từ
          const minPhraseLength = words.length > 1 ? 2 : 1; // Ít nhất 1 từ nếu keyword chỉ có 1 từ
          const subphrases = [];
          for (let i = 0; i < words.length; i++) {
            for (let j = minPhraseLength; j <= words.length - i; j++) {
              subphrases.push(words.slice(i, i + j).join(' '));
            }
          }
      
          // Xây dựng điều kiện WHERE
          const conditions = subphrases.map(phrase => {
            const columns = [
              'Web', 'Dim_NganhCon.NganhCon', 'TenCV', 'CongTy',
              'Dim_TinhThanh.TinhThanh', 'Dim_LoaiHinh.LoaiHinh', 
              'Dim_KinhNghiem.KinhNghiem', 'Luong', 'Dim_CapBac.CapBac'
            ];
            return columns.map(col => `${col} LIKE '%${phrase}%'`).join(' OR ');
          }).join(' OR ');
      
          const query = `
            SELECT Web, Dim_NganhCon.NganhCon, Link, TenCV, CongTy, 
                   Dim_TinhThanh.TinhThanh AS TinhThanh, Dim_LoaiHinh.LoaiHinh AS LoaiHinh, 
                   HanNopCVDate AS HanNopCV, Dim_KinhNghiem.KinhNghiem AS KinhNghiem, 
                   LuongETL AS Luong, Image, ID, MoTa, YeuCau, PhucLoi, 
                   Dim_CapBac.CapBac AS CapBac, LuongTB, Dim_KhoangLuong.KhoangLuong AS KhoangLuong, 
                   SoLuong 
            FROM ThongTinTuyenDung.Data_Lake
            LEFT JOIN Dim_TinhThanh ON Data_Lake.ID_TinhThanh = Dim_TinhThanh.ID_TinhThanh
            LEFT JOIN Dim_LoaiHinh ON Data_Lake.ID_LoaiHinh = Dim_LoaiHinh.ID_LoaiHinh
            LEFT JOIN Dim_KinhNghiem ON Data_Lake.ID_KinhNghiem = Dim_KinhNghiem.ID_KinhNghiem
            LEFT JOIN Dim_CapBac ON Data_Lake.ID_CapBac = Dim_CapBac.ID_CapBac
            LEFT JOIN Dim_NganhCon ON Data_Lake.ID_NganhCon = Dim_NganhCon.ID_NganhCon
            LEFT JOIN Dim_KhoangLuong ON Data_Lake.ID_KhoangLuong = Dim_KhoangLuong.KhoangLuong_ID
            ${conditions ? 'WHERE ' + conditions : ''};
          `;
      
          const rows = await new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                if (err) {
                    console.error('Error executing query:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
            
        });
        connection.release();
          res.status(200).json({"results": rows, "keyword": keyword});
        } catch (error) {
          console.error('Lỗi tìm kiếm:', error);
          res.status(500).json({ error: 'Lỗi server' });
        }
      }
}

module.exports = new ControllerWebsite();
