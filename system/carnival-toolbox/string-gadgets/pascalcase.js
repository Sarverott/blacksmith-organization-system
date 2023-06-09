/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of kebabcase:

    SomeCompressVarName

*/
module.exports={
  //
  from(i){
    var o=[""], x=i.length;
    //console.log(i);
    do{
      o[0]=i[--x]+o[0];
      if(
        x
        &&
        i.charCodeAt(x)>59
        &&
        i.charCodeAt(x)<91
      )o.unshift("");
    }while(x);
    return o.map((x)=>x.toLowerCase());
  },
  //
  to(o){
    return o.map((x)=>x[0].toUpperCase()+x.substr(1).toLowerCase()).join("");
  }
  //
};
