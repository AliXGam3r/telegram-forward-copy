const { main, logout } = require("./tlBot");
const express = require("express");
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

let codeCallback;
let startStatus;
app.get("/start", (req, res) => 
{
    main(req.query.phone);
    startStatus = res;
    return true;
});

app.get("/", (req, res) =>
{
    res.json({ success: "true", error: "", data: "Hey, there stranger!" });
})

app.get("/code", (req, res) =>
{
    codeCallback(req.query.code);

    res.json({ success: "true", error: "", data: "" });
});

app.get("/logout", (req, res) =>
{
    logout(() =>
    {
        res.json({ success: "true", error: "", data: "" });
    })
});

function loggedIn()
{    
    startStatus.json({ success: true, error: "", data: "Logged in" });
    startStatus = null;
}


function subscribeToCode(callback)
{
    codeCallback = callback;
    startStatus.json({ success: true, error: "", data: "Please submit the auth code with: URL.xxx/code?code=XXX" });
    startStatus = null;
}

app.listen(port, () =>
{
    console.log("up and running");
});
module.exports = { subscribeToCode, loggedIn };
