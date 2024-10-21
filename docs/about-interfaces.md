# INTERFACES TO STANDARD INTERACTIONS
> - CLI implementation
> - serve as API
> - using desktop feachers



by default __INTERFACE__ includes some feachers from `${BOS}/system/interfaces/${INTERFACE}` dir:
###### interface space
```js
DIRTREE={
  `interfaces`:{
    `${interface_name}`:{
      `index.js`, //main declaration of interface
      `init.js`, //contains initializer function
      `loop.js`, //contains execution looper
      `setup.js`, //returns custom setup object for MAIN_HOOK
      ...eventList.each=(event)=>`on-${event}.js` //custom event declaration
    },
    ...,
    `README.md`
  },
  ...
}

```

[go to main README.md](../README.md)
