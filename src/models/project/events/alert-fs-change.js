

function eventFunction(itemHook, eventType, filename, watchedPath){
    console.log(itemHook, eventType, filename, watchedPath);
}

module.exports=eventFunction;