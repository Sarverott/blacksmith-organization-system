/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of snakecase:

    some_compress_var_name

*/
module.exports={
  //
  from(i){
    return i.split("_");
  },
  //
  to(o){
    return o.map((x)=>x.toLowerCase()).join("_");
  }
  //
};
