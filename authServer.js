require("dotenv").config()

const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const app = express()
const jwt = require ('jsonwebtoken')

let refreshTokens = []

app.use(express.json())

app.post("/token",(req,res)=> {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,user) =>{
        if(err) return res.sendStatus(403)
        const acessToken = generateAcessToken({name:user.name})
        res.json({acessToken:acessToken})
    })
})


const posts = [
    { username : "alex",
      post : "post1"
    },
    {
    username : "sam",
      post : "post2"
    }
];
/*
app.get("/posts",authenticateToken,(req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name))
})
*/

app.post("/login",(req,res)=>{
    //autheticate user
    const username = req.body.username
    const user = { name:username }
    const accessToken = generateAcessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    res.json({accessToken:accessToken,refreshToken:refreshToken})
})

function  generateAcessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'})
}


app.listen(4000)