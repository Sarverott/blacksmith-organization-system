/*
  Carnival Toolbox - pack of commonly needed js functions
  Sett Sarverott @ 2022
  example of use of this tools:

  //#1
    const carnival={stringGadgets};

    var cameled = stringGadgets.transform("YELING_RATTLESNAKES").from("bigsnakecase").to("camelcase").GO
    console.log(cameled) //Output:   yelingRattlesnakes


*/


const CHANGE_METHODS=[ //         **with cheetsheet**
  "kebabcase", //     kebab-case
  "normalcase", //    normal case
  "camelcase", //     camelCase
  "pascalcase", //    PascalCase
  "snakecase", //     snake_case
  "bigsnakecase", //  BIG_SNAKE_CASE
  "initials", //      i
  "biginitials" //    BI
].reduce(
  (acc, caseName)=>({
    ...acc,
    [caseName]:require(`./${caseName}.js`)
  }),
  {}
);

class Namespacer{
  constructor(input, setup={}){
    this.scope="single";
    this.input=input;
    this.caseFrom=null;
    this.caseInto=null;
    this.output=null;
    Object.assign(this, setup);
  }
  from(casename){
    this.caseFrom=CHANGE_METHODS[casename].from;
    return this;
  }
  to(casename){
    this.caseInto=CHANGE_METHODS[casename].to;
    return this;
  }
  get GO(){
    this.transfer();
    return this.output;
  }
  transfer(){
    this.output=this.caseInto(
      this.caseFrom(
        this.input
      )
    );
  }
}
module.exports={
  transform(input){
    return new Namespacer(input);
  }
}
