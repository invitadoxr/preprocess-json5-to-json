# preprocess-json5-to-json
watch/compile commands for transform json5 to json easily  
  
  
compile   : compile a single json5 to json  
watch     : watch a folder, any json5 changed/saved is compile to json  
stopWatch : stop the watch  
  
  
### Warning
NOT use with any dynamic json or a file than can be changed  
by others programs or source, this is cause problems of race,  
the version than you could edit, probably is diferent from   
the changed for the other program.  
NOT use for example with :   
* package.json  
  
  
imagine a json5 like : 
```
{
  // inline comment
  /*
    multiline
    comment
  */
  // /* tricky inline    comment */ // */
  /* // tricky multiline comment */
  /** @type { null } valid */
  "multilineBetween" : /* multiline INVALID */ "but still successfully compiled",
  "inline"  : "valid", // inline

  // accept any form of json5
  // no quoted, single or double quotes
  noQuoted : 'no-quoted "with inside double" ',
  // lineBreaks
  'lineBreaks' : '\
line \
breaks',
  // hexadecimal, leadingDecimalPoint, trailingDecimal, positiveSign
  // trailingComma in objects and arrays
  object : { first : '1', second : '2', },
}
```

but your program, service, source only accept json,
you can transform using the api of the json5,
but with this extension, 
you can watch for changes or compile a single file 
with just run a command and will get : 

```
{
  "multilineBetween": "but still successfully compiled",
  "inline": "valid",
  "noQuoted": "no-quoted \"with inside double\" ",
  "lineBreaks": "line breaks",
  "object": {
    "first": "1",
    "second": "2"
  }
}
```
