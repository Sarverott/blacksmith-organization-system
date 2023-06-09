/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of big initials:

    SCVN

*/
module.exports={
  //
  from(i){
    throw "INITIAL_CASE_IS_ONEWAY_METHOD!";
  },
  //
  to(o){
    return o.map((x)=>x[0].toUpperCase()).join("");
  }
  //
};
