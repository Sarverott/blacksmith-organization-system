/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of kebabcase:

    some-compress-var-name

*/
module.exports={
  //
  from(i){
    return i.split("-");
  },
  //
  to(o){
    return o.map((x)=>x.toLowerCase()).join("-");
  }
  //
};
