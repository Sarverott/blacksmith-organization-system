/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of big snakecase:

    SOME_COMPRESS_VAR_NAME

*/
module.exports={
  //
  from(i){
    return i.split("_");
  },
  //
  to(o){
    return o.map((x)=>x.toUpperCase()).join("_");
  }
  //
};
