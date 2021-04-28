//module instances
const mysql = require('mysql');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//MySQL connection
const dbCon = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'kunal@1995',
	database: 'employeedb',
	port: '3306',
	multipleStatements: true
});


dbCon.connect((err) => {
	if (!err)
		console.log('Connection Established Successfully');
	else
		console.log('Connection Failed!');
});



//access all employee from employee table
app.get('/getAllEmp', (req, res) => {
	dbCon.query('SELECT * from employee ', (err, rows, fields) => {
		if (!err)
			return res.send({ "data": rows });
		res.send({ "err": err });
	})
});


//access employee with id
app.get('/getAllEmp/:id', (req, res) => {
	dbCon.query('SELECT * from employee  where EmpID =  ?', [req.params.id], (err, rows, fields) => {
		if (!err)
			return res.send({ "data": rows });
		res.send({ "err": err });
	})
});


//access all info from employment_department table
app.get('/getEmpData', (req, res) => {
	const getQuery = `SELECT 
            a.EmpID, a.EmpName, b.DeptName
          FROM
            employee a,
            department b,
            employee_department c
          WHERE
            a.EmpId = c.EmpId
                AND b.DeptId = c.DeptId`;

	dbCon.query(getQuery, (err, rows, fields) => {
		if (!err)
			return res.send({ "data": rows });
		res.send({ "err": err });
	});
});


//creating new employee in employee table
app.post('/employee', (req, res) => {
	console.log("Payload Data: ", req.body)
	let data = { EmpID: req.body.EmpID, EmpName: req.body.EmpName, EmpAge: req.body.EmpAge };
	dbCon.query('Insert into employee SET ?', data, (err, rows, fields) => {
		if (!err) {
			console.log("inserted");
			return res.status(201);
		}
		return res.send({ "err": err });

	});

});


//updating empName and EmpAge using EmpID
app.put('/employee', (req, res) => {
	dbCon.query('UPDATE employee SET EmpName=?,EmpAge=? WHERE EmpID = ?', [req.body.EmpName, req.body.EmpAge,req.body.EmpID], (err, results, fields) => {
			if(!err)
			res.send(JSON.stringify(results));
			else
			res.send({ "err": err });
	})



});



//creating server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}..`));
