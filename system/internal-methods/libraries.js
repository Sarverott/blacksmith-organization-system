module.exports=function(){
  return {
    os:require("os"),
    tls:require("tls"),
    crypto:require("crypto"),
    http:require("http"),
    https:require("https"),
    net:require("net"),
    child_process:require("child_process"),
    fs:require("fs"),
    path:require('path'),
    carntools:require('carnival-toolbox'),
  }
}
