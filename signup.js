
import express from "express";
import path from "path";
import https from "https";

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));//To serve all the static files inside public directory and by default  
                                  //our app is inside public directory so to give path to any file inside dont use /public/.

const __dirname = path.resolve();
app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/", (req, res)=>{
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    // The formate in which mailchimp accepts data to store in its server.
    const jsonData = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const stringData = JSON.stringify(jsonData);

    // how to send stringData to mailchimp server.
    // mailchimp api endpoint with lists and list_id as path.
    const url = "https://us5.api.mailchimp.com/3.0/lists/"+process.env.AUDIENCE_KEY;
    // we are explicitly telling to make https post request.
    const option = {
        method: "POST",
        auth: process.env.API_KEY
    }

    // making https request on mailchimp server
    const request = https.request(url, option, (response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
    });
    
    request.write(stringData);
    request.end();
    
});


app.post("/failure", (req ,res)=>{
    res.redirect("/");
});

app.post("/success", (req ,res)=>{
    res.redirect("https://afternoon-earth-85109.herokuapp.com/");
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running on port 3000");
});

