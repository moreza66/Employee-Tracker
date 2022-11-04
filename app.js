//======== Dependencies===================//
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
require('dotenv').config()


const test = mysql.createConnection({
    host: "127.0.0.1",
    // port: 3306,
    user: "root",
    password: "ehlambanoo",
    database: "employee_trackerDB"
  });

  //========== Connection ID ==========================//
  test.connect(function(err){
    if (err) throw err;
    options();
})

//================== Initial Prompt =======================//
  function options() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'WELCOME TO EMPLOYEE TRACKER! Lets Have Some Action!?',
            choices: [
                    'View all employees',
                    'View all departments',
                    'View all roles',
                    'Add an employee',
                    'Add a department',
                    'Add a role',
                    'Update employee role',
                    'Delete an employee',
                    'EXIT'
                    ]
            }).then(function (answer) {
                switch (answer.action) {
                    case 'View all employees':
                        viewEmployees();
                        break;
                    case 'View all departments':
                        viewDepartments();
                        break;
                    case 'View all roles':
                        viewRoles();
                        break;
                    case 'Add an employee':
                        addEmployee();
                        break;
                    case 'Add a department':
                        addDepartment();
                        break;
                    case 'Add a role':
                        addRole();
                        break;
                    case 'Update employee role':
                        updateRole();
                        break;
                    case 'Delete an employee':
                        deleteEmployee();
                        break;
                    case 'EXIT': 
                        exitApp();
                        break;
                    default:
                        break;
                }
        })
};


//============= View All Employees ==========================//
function viewEmployees() {
    let query = 'SELECT * FROM employee';
    test.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res); 
        options();
    })
};

//============= View All Employees By Departments ==========================//
function viewDepartments() {
    let query = 'SELECT * FROM department';
    test.query(query, function(err, res) {
        if(err)throw err;
        console.table('All Departments:', res);
        options();
    })
};

//============= View All Roles ==========================//
function viewRoles() {
    let query = 'SELECT * FROM role';
    test.query(query, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        options();
    })
};

//============= Add Employee ==========================//
function addEmployee() {
    test.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "Please enter the employee's fist name!",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "Please enter the employee's last name! "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "Please enter the employee's manager's ID! "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    let roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "Please enter the employee's role! "
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            role_id = res[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    test.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Employee information has been updated!');
                        options();
                    })
                })
        })
};

//============= Add Department ==========================//
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Please add the department here:'
            }
            ]).then(function (answer) {
                test.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
            let query = 'SELECT * FROM department';
                test.query(query, function(err, res) {
                if(err)throw err;
                console.log('Department information has been updated!');
                console.table('All Departments:', res);
                options();
                })
            })
};

//============= Add Employee Role ==========================//
function addRole() {
    test.query('SELECT * FROM department', function(err, data) {

        

            const departmentChoices = data.map(({id,name})=> ({
                name : name, 
                value : id
            }))
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "Please add the new rolle title!"
            },
            {
                name: 'salary', 
                type: 'input',
                message: 'Please enter the employee salary!'
            },
            {
                name: 'Department',
                type: 'list',
                choices: departmentChoices
          
            }
        ]).then(function (answer) {
            let department_id = answer.name
          
        
    
            test.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('Role information has been updated!');
                    console.table('All Roles:', res);
                    options();
                })
        })
    })
};
//============= Update a role ==========================//
function updateRole() {

};

//============= Delet an employee ==========================//
function deleteEmployee() {

};

//============= EXIT ==========================//
function exitApp() {
    test.end();
};