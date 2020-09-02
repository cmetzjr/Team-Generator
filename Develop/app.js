const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// code to use inquirer to gather information about the development team members,
const questions = [{
        type: "list",
        name: "role",
        message: "Select employee role:",
        choices: ["Manager", "Engineer", "Intern"]
    },
    {
        type: "input",
        name: "name",
        message: "Employee name:"
    },
    {
        type: "input",
        name: "id",
        message: "Employee ID:"
    },
    {
        type: "input",
        name: "email",
        message: "Employee email:"
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Manager's office number:",
        when: function (questions) {
            return questions.role === "Manager"
        }
    },
    {
        type: "input",
        name: "gitHub",
        message: "Engineer's GitHub username:",
        when: function (questions) {
            return questions.role === "Engineer"
        }
    },
    {
        type: "input",
        name: "school",
        message: "Intern's school name:",
        when: function (questions) {
            return questions.role === "Intern"
        }
    },
    {
        type: "list",
        name: "another",
        message: "Would you like to enter another employee?",
        choices: ["YES", "NO"]
    }
]

const employees = [];

// objects for each team member (using the correct classes as blueprints!)
function writeEmployeeObj(content) {
    switch (content.role) {
        case "Manager":
            const manager = new Manager(
                content.name,
                content.id,
                content.email,
                content.officeNumber,
            )
            employees.push(manager);
            break;
        case "Engineer":
            const engineer = new Engineer(
                content.name,
                content.id,
                content.email,
                content.gitHub,
            )
            employees.push(engineer);
            break;
        case "Intern":
            const intern = new Intern(
                content.name,
                content.id,
                content.email,
                content.school,
            )
            employees.push(intern);
            break;
    }
}

//call inquirer to begin prompting the user
function init() {
    inquirer.prompt(questions).then(
        (data => {
            //if user wants to add another employee, then prompt questions again, else renter the html
            if (data.another === "YES") {
                writeEmployeeObj(data);
                init();
            } else {
                writeEmployeeObj(data);
                const html = render(employees);
                //check if output exists, create if not
                if (fs.existsSync('./output')) {
                    fs.writeFile(outputPath, html, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Success! The team members were added. The rendered HTML page can be found at ./output/team.html");
                    })
                } else {
                    fs.mkdir('./output', (err) => {
                        if (err) throw err;
                    });
                    fs.writeFile(outputPath, html, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Success! The team members were added. The rendered HTML page can be found at ./output/team.html");
                    })
                }
            }
        })
    )
}

init();