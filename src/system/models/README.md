# MODELS MAKES BASE FOR LOGIC TREE OF BOS
> __Blacksmith Organization System__ MODELS TREE
> - workshop
>   - forge
>     - superproject
>       - project
>       - scheme
>       - throwbox
>   - arvhive
>     - sarcophag



by default __MODEL__ includes some feachers from `${BOS}/system/models/${MODEL}` dir:
###### models space
```js
DIRTREE={
  `models`:{
    `${model_type}`:{
      `class.js`, //main declaration of model
      `index.json`, //base for folder descriptors
      `actions`:{ //_DIR_ commands and available acts
        ...actionList.each=(action)=>`${action}.js` //custom action declaration
      },
      `methods`:{ //_DIR_ synchronous static functions, resulting with return values
        ...methodList.each=(method)=>`${method}.js` //custom event declaration
      },
      `listeners`:{ //_DIR_ all watchers and other stuff
        ...listenerList.each=(listener)=>`${listener}.js` //custom event declaration
      },
      `events`:{ //_DIR_ basic behaviour
        ...eventList.each=(event)=>`on-${event}.js` //custom event declaration
      },
      `extenders`:{ //_DIR_ flat extension for every new object, produced by class.js
        ...extList.each=(ext)=>`${ext}.js` //custom event declaration
      },
      `README.md` //explanation role of model
    },
    ...,
    `README.md`
  },
  ...
}

```

[go to main README.md](../../README.md)
