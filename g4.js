const mysql=require("mysql")
const express=require("express")
const app=express()
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
require("dotenv").config()
let PORT=process.env.port
// console.log(process.env.port);

const connect=mysql.createConnection({
    host:"localhost",
    password:"",
    user:'root',
    database:"g4"
})
// ****creating table when clicking 

app.get("/table",(req,res)=>{

    //***** */ comment table

    comment =`create table if not exists  comment (comment varchar(222))`
    connect.query(comment,(err)=>{
        if(err)console.log(err);
        console.log('done')})

        //******** */ login table

    login =`create table if not exists  login (email varchar(222),fist_name varchar(222) ,last_name varchar(222),password varchar(222))`
    connect.query(login,(err)=>{
        if(err)console.log(err);
        console.log('done')})
        
           //******** */ bio table
let bioTable=`create table if not exists bio (bio_id int auto_increment primary key,fname varchar(50) not null,lname varchar(50) not null,nname varchar(50) not null,age int(10) not null,sex varchar(50) not null,nationality varchar(50) not null)`
connect.query(bioTable)

// status table
let statusTable=`create table  if not exists status (period varchar(50),bio_id int(12) not null,substance varchar(50) not null ,foreign key(bio_id) references bio(bio_id))`
connect.query(statusTable)

// narration table
let narration=`create table if not exists narrate (narration varchar(200) not null,bio_id int(12) not null,foreign key(bio_id) references bio(bio_id))`
connect.query(narration)

// response ended
res.end("you can begin filling your form go back to home page")
})


//**** */ sign up data insertion part 

app.post("/login",(req,res)=>{
    const { email,first,last,pass } = req.body;
let log =`insert into login  VALUES("${email}","${first}","${last}","${pass}")`
connect.query(log)
res.end("done")
})

//*** */ sign up password checking part
app.post("/were",(req,res)=>{
                const {em,pa} =req.body
                
                console.log(pa);
                
                // generating the password form the row containing the email inserted
                connect.query(`select * from login where email="${em}"`,(err,rows,fields)=>{
            
            const {pa}=req.body
                    let added=rows[0].password
                
                    // comparing the data from the database with the data passed from the form
                if (added ==`${pa}`) {
                    res.end("<h1>SUCCESSFUL logged in</h1>");}
                    else{
                        res.end("<h1>incorrect password</h1>")
                    }
                }
    
)}
)
        
// ***data(bio,status and narration) data insertion part
app.post("/bio",(req,res)=>{
  
                            console.log(req.body);
                            const { f,l,n,a,s,na,ho,sub,nar } = req.body;

                            // ****biographic data
                        let insertBIO =`insert into bio (fname ,lname ,nname,age ,sex ,nationality) VALUES("${f}","${l}","${n}",${a},"${s}","${na}")`
                        connect.query(insertBIO,(err,rows,fields)=>{
                            if(err)console.log(err);
                                    console.log('done');
                        })

                        //selecting and then  generating the bio_id from the inserted bio data and pass to the others where it works as foreign key
                        connect.query(`select * from bio where fname="${f}"`,(err,rows,fields)=>{
                            
                            // the bio id is the bio_id among the row[0]
                        let added=rows[0].bio_id

                        // insert status data
                        let statusBIO =`insert into status VALUES("${ho}","${added}","${sub}")`;
                        connect.query(statusBIO,(err)=>{
                            if(err)console.log(err);
                            console.log('done');
                            })
                        // // // insert narration data
                        let narrated =`insert into narrate  VALUES("${nar}","${added}")`
                        connect.query(narrated,(err)=>{
                        if(err)console.log(err);
                        console.log('done');
                        })
                        res.send(`<h3>WELL DONE</h3> <h4>your id number</h4> is <h1>${added} `)
                        res.end()
                        }

                        )
                
   
})

// ****deleting the data of any client using id
app.post("/delete",(req,res)=>{
    // const { ww } = req.body;
    let ww=req.body.ww
    console.log(ww);
    let deleteee=`delete from bio where bio_id ="${ww}" `
    console.log(req.body.deletee);
    
    connect.query(deleteee)
    res.end("deleted")
})


// updating a status using id 
app.post("/update",(req,res)=>{
    const { names,status} = req.body;
  
    let update=`update narrate  set narration ="${status}" where bio_id=${names} ` 

    
    connect.query(update)
    res.end("updated")
})


// generating data of high risk client

app.post("/info", (req, res) => {
	connect.query(
		`SELECT * FROM bio where age<26 && sex="female"` ,
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);

			// res.send(results);
            // res.write("<p>the name of the clients is</p>")
            res.send (`the client information is <p>FIRST NAME:</p><h1>${results.map(element=>element.fname) }</h1>LAST NAME:<h1>${results.map(element=>element.lname) }</h1>--; NICK NAME: <h1>${results.map(element=>element.nname) }</h1> AGE: <h1>${results.map(element=>element.age) }</h1> SEX:<h1>${results.map(element=>element.sex) }</h1> NATIONALITY:american  <h1>${results.map(element=>element.nationality) }</h1>`)
		

		}
	);
});

// generating data from the status table who is foreigner
app.post("/save", (req, res) => {
	connect.query(
		`SELECT   bio_id FROM bio where nationality="no" ` ,
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);

            console.table(results);
            
      
res.send(`<h3>the id for the foreigner client is</h3> <h1>${results.map(element=>element.bio_id).toString()}</h1><h4>give him a special care</h4>`)
		}
	);

    connect.query(`SELECT fname, lname, age FROM bio`)
  
    
});


// commenting data entry part
app.post("/comment",(req,res)=>{
    const { comment } = req.body;
let commenting =`insert into comment  VALUES("${comment}")`
connect.query(commenting)
res.end("thanks for your time for commenting")
})



app.listen(PORT)


// thank you for your time