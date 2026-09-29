

function eventFunction(itemHook, eventType, filename, watchedPath){
    // set BOS_DEBUG=1 to trace filesystem events
    if(process.env.BOS_DEBUG)console.log(`[${itemHook.type}] ${eventType} ${filename} in ${watchedPath}`);
}

module.exports=eventFunction;