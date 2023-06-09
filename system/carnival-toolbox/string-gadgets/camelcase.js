/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of camelcase:

    someCompressVarName

*/
module.exports={
  //
  from(i){
    var o=[""], x=i.length;
    do{
      o[0]=i[--x]+o[0];
      if(x&&i.charCodeAt(x)>59&&i.charCodeAt(x)<91)o.unshift("");
    }while(x);
    return o.map((x)=>x.toLowerCase());
  },
  //
  to(o){
    return o.map(
      (x, k)=>
        (k>0)
        ?
        x[0].toUpperCase()+x.substr(1).toLowerCase()
        :
        x.toLowerCase()
    ).join("")
  }
  //
};
