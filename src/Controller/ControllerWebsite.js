const connectDB = require('../Config/Connect');
// Lớp controller
class ControllerWebsite {
// Hàm getData
    async getData(req, res) {
        try {
            // Tạo một kết nối cơ sở dữ liệu bằng cách sử dụng một Promise
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

            // Query data 
            const rows = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM Data_Lake', (err, rows) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            // Release the connection back to the pool
            connection.release();

            // Send the result as JSON
            res.json(rows);
        } catch (err) {
            console.error('Internal Server Error:', err);
            res.status(500).send('Internal Server Error');
        }
    }
    // Hàm search job + filter tỉnh thành
    async SearchJobs(req, res) {
        try {
            const searchTerm = req.query.valueSearch;
            const searchProvince = req.query.searchProvince;

            let query = `SELECT * FROM stg_thongtin_test WHERE TenCV LIKE ?`;
            const params = [`%${searchTerm}%`];

            if (searchProvince) {
                query += ` AND TinhThanh = ?`;
                params.push(searchProvince);
            }

            connectDB.query(query, params, (error, results, fields) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                return res.status(200).json(results);
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ControllerWebsite();
