(function() {
    var error = false; //ABK
    // ## A Datanode Plugin
    //
    // -------------------
    // ### Datanode Definition
    //
    // -------------------
    // **datanodesManager.loadDatanodePlugin(definition)** tells datanodesManager that we are giving it a datanode plugin. It expects an object with the following:
    datanodesManager.loadDatanodePlugin({
        // **type_name** (required) : A unique name for this plugin. This name should be as unique as possible to avoid collisions with other plugins, and should follow naming conventions for javascript variable and function declarations.
        "type_name": "CSV_file_player_plugin",
        // **display_name** : The pretty name that will be used for display purposes for this plugin. If the name is not defined, type_name will be used instead.
        "display_name": "CSV file player",
        // **icon_type** : icon of the datanode type displayed in data list
        "icon_type": "csv-player.svg",
        // **description** : A description of the plugin. This description will be displayed when the plugin is selected or within search results (in the future). The description may contain HTML if needed.
        "description": "Play csv files",
        // **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
        "external_scripts": [],
        // **settings** : An array of settings that will be displayed for this plugin when the user adds it.
        "settings": [{
                "name": "data_path",
                "display_name": "Data file",
                "description": "Browse to select CSV data file.",
                // **type "boolean"** : Will display a checkbox indicating a true/false setting.
                "type": "browseText",
                "accept": "text/csv",
                required: true //ABK
            },
            {
                "name": "delimiter",
                "display_name": "Delimiter",
                "description": "The delimiting character. Leave auto to auto-detect.",
                // **type "option"** : Will display a dropdown box with a list of choices.
                "type": "option",
                // **options** (required) : An array of options to be populated in the dropdown.
                "options": [{
                        // **name** (required) : The text to be displayed in the dropdown.
                        "name": "auto",
                        // **value** : The value of the option. If not specified, the name parameter will be used.
                        "value": ""
                    },
                    {
                        "name": "comma",
                        "value": ","
                    },
                    {
                        "name": "semi-colon",
                        "value": ";"
                    },
                    {
                        "name": "colon",
                        "value": ":"
                    },
                    {
                        "name": "tabulation",
                        "value": "\t"
                    },
                    {
                        "name": "space",
                        "value": " "
                    }
                ]
            },
            {
                "name": "eol",
                "display_name": "Line endings",
                "description": "The newline sequence. Leave auto to auto-detect.",
                // **type "option"** : Will display a dropdown box with a list of choices.
                "type": "option",
                // **options** (required) : An array of options to be populated in the dropdown.
                "options": [{
                        // **name** (required) : The text to be displayed in the dropdown.
                        "name": "auto",
                        // **value** : The value of the option. If not specified, the name parameter will be used.
                        "value": ""
                    },
                    {
                        "name": "\\n",
                        "value": "\n"
                    },
                    {
                        "name": "\\r",
                        "value": "\r"
                    },
                    {
                        "name": "\\r\\n",
                        "value": "\r\n"
                    }
                ]
            },
            {
                "name": "quote_char",
                "display_name": "Quote Char",
                "description": "The character used to quote fields. The quoting of all fields is not mandatory. Any field which is not quoted will correctly read.",
                // **type "option"** : Will display a dropdown box with a list of choices.
                "type": "option",
                // **options** (required) : An array of options to be populated in the dropdown.
                "options": [{
                        // **name** (required) : The text to be displayed in the dropdown.
                        "name": "\"",
                        // **value** : The value of the option. If not specified, the name parameter will be used.
                        "value": "\""
                    },
                    {
                        "name": "\'",
                        "value": "\'"
                    },
                    {
                        "name": "empty",
                        "value": ""
                    }
                ]
            },
            {
                "name": "head",
                "display_name": "Header line",
                "description": "If true, the first row after metaData of parsed data will be interpreted as field names.",
                // **type "boolean"** : Will display a checkbox indicating a true/false setting.
                "type": "boolean",
                "default_value": true
            },
            {
                "name": "nb_meta_lines",
                "display_name": "Number of metaData lines",
                "type": "number",
                "default_value": 0,
                "description": "If 0 no metaData exist before the header line. Otherwise metaData will be placed inside \'meta\' object."
            },
            {
                "name": "nb_subheader_lines",
                "display_name": "Number of subheader lines",
                "type": "number",
                "default_value": 0,
                "description": "If 0 no subheader exist after the header line. Otherwise subheader will be placed inside \'subheader\' object."
            },
            {
                "name": "skip_empty_lines",
                "display_name": "Skip empty lines",
                // **type "boolean"** : Will display a checkbox indicating a true/false setting.
                "type": "boolean",
                "default_value": true
            },
            {
                "name": "dynamic_typing",
                "display_name": "Dynamic typing",
                "description": "If true, numeric and boolean data will be converted to their type instead of remaining strings.",
                // **type "boolean"** : Will display a checkbox indicating a true/false setting.
                "type": "boolean",
                "default_value": true
            },
            {
                name: "sampleTime",
                display_name: "Sample time",
                type: "number",
                suffix: "seconds",
                default_value: 1
            },
            {
                "name": "time_included",
                "display_name": "Time included",
                "description": "If true, the first row will be considered as time vector.",
                // **type "boolean"** : Will display a checkbox indicating a true/false setting.
                "type": "boolean",
                "default_value": false
            },
            {
                "name": "playback",
                "display_name": "Playback",
                "description": "If true, data will be played back.",
                // **type "boolean"** : Will display a checkbox indicating a true/false setting.
                "type": "boolean",
                "default_value": true
            }
        ],
        expose_as_files: [
            {
                key: "content",
                nameSuffix: (settings) => settings?.content?.name ?? "data.csv",
                getter: (settings) => {
                    const content = settings.content;
                    if (typeof content === 'string') {
                        return b64EncodeUnicode(content);
                    } else {
                        return content.isBinary ? content.content : b64EncodeUnicode(content.content);
                    }
                },
                setter: (settings, value) => {
                    const content = settings.content;
                    if (typeof settings.content === 'string') {
                        settings.content = b64DecodeUnicode(value);
                    } else {
                        settings.content = {...settings.content, content: value, isBinary: true };
                    } 
                },
            },
        ],
        // **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
        // * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
        // * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
        // * **updateCallback** : A callback function that you'll call if and when your datanode has an update for datanodesManager to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
        newInstance: function(settings, newInstanceCallback, updateCallback, statusCallback, notificationCallback) {
            // csvFilePlugin is defined below.
            newInstanceCallback(new csvFilePlugin(settings, updateCallback, statusCallback, notificationCallback));
            if (error) //ABK
                return false;
            else
                return true;
        }
    });

  // ### Datanode Implementation
  //
  // -------------------
  // Here we implement the actual datanode plugin. We pass in the settings and updateCallback.
  var csvFilePlugin = function (settings, updateCallback, statusCallback) {
    // initialize bad result value in case of error
    var badResult = null;
    //initialize error at new instance
    error = false;
    // Always a good idea...
    var self = this;

    // ### Datanode Implementation
    //
    // -------------------
    // Here we implement the actual datanode plugin. We pass in the settings and updateCallback.
    var csvFilePlugin = function(settings, updateCallback, statusCallback, notificationCallback) {
        // Always a good idea...
        const self = this;

        // Good idea to create a variable to hold on to our settings, because they might change in the future. See below.
        let currentSettings = settings;

        // Parser results to memorize
        let parserResults = undefined;

        // Csv File player pointer position
        let nextRow = 0;

        // **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
        self.onSettingsChanged = function(newSettings, status) {
            // Here we update our current settings with the variable that is passed in.			
            const newData = self.parseFile(newSettings.content);
            if(newData) {
                currentSettings = newSettings;
                parserResults = newData;
                nextRow = 0;
                return true;
            } else {
                return false;
            }
        };

        self.isSettingNameChanged = function(newName) {
            return currentSettings.name !== newName;
        };

        self.isSettingSampleTimeChanged = function(newSampleTime) {
            return currentSettings.sampleTime !== newSampleTime;
        };

        /* This is some function where I'll get my data from somewhere */
        function nextData() {
            const newData = {};
            for (const col of Object.keys(parserResults.content)) {
                newData[col] = parserResults.content[col][nextRow];
            }
    
            if (currentSettings.nb_meta_lines > 0 || currentSettings.nb_subheader_lines > 0) {
                newData = { content: newData };
                if (currentSettings.nb_meta_lines > 0) {
                    newData.meta = { ...parserResults.meta };
                }
                if (currentSettings.nb_subheader_lines > 0) {
                    newData.subheader = { ...parserResults.subheader };
                }
            }

            if (currentSettings.playback) {
                nextRow += 1;
                if (nextRow >= parserResults.rows) {
                    nextRow = 0;
                } 
            }

            pastStatus = "OK";
            statusCallback("OK");
            updateCallback(newData); //AEF: always put statusCallback before updateCallback. Mandatory for scheduler.
        }

        // **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datanode
        self.updateNow = function() {
            //AEF TODO: maybe think in the future the need to reset pointerPos when click on refresh
            //     pointerPos = 0;
            if(parserResults === undefined) {
                parserResults = self.parseFile(currentSettings.content);
                nextRow = 0;
            }             

            if(parserResults) {
                nextData();
            } else {
                statusCallback('Error', 'Error in file parse');
                updateCallback(null);
            }
        };

        // **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
        self.onDispose = function() { };

        self.canSetValue = function() {
            return {
                acceptPath: false,
                hasPostProcess: true,
            };
        };

        self.setValue = function (path, value) {
            if (value.content) {
                const newData = self.parseFile(value.content);
                if(newData) {
                    currentSettings.content = { ...value };
                    currentSettings.data_path = value?.name;
                    parserResults = newData;
                    nextRow = 0;
                }
            }
        };

        self.isInternetNeeded = function() {
            return false;
        };

        self.parseFile = function(data) {
            let content = null;
            if (typeof data === 'string') {
                content = data;
            } else if (data.content) {
                content = data.isBinary ? atob(data.content) : data.content;
            } else {
                notificationCallback("error", currentSettings.name, "Invalid content");
            }

            return self.parseContent(content);
        }

        self.parseContent = function(content) {
            const papaSettings = {
                delimiter: currentSettings.delimiter,
                newline: currentSettings.eol,
                quoteChar: currentSettings.quote_char,
                header: currentSettings.head,
                dynamicTyping: currentSettings.dynamic_typing,
                skipEmptyLines: currentSettings.skip_empty_lines
            };

            const metaObj = {};
            const subheaderObj = {};

            //
            if (_.isUndefined(currentSettings.nb_meta_lines)) {
                currentSettings.nb_meta_lines = 0;
            }
            if (_.isUndefined(currentSettings.nb_subheader_lines)) {
                currentSettings.nb_subheader_lines = 0;
            }
            //
            if (currentSettings.nb_meta_lines > 0) {
                const lines = content.split('\n');
                const meta = lines.splice(0, currentSettings.nb_meta_lines);
                for (let i = 0; i < meta.length; i++)
                    metaObj["metaLine" + i] = meta[i];
                content = lines.join('\n');
            }
            if (currentSettings.nb_subheader_lines > 0) {
                const lines = content.split('\n');
                const subheader = lines.splice(1, currentSettings.nb_subheader_lines);
                for (let i = 0; i < subheader.length; i++) {
                    subheaderObj["subheaderLine" + i] = subheader[i];
                    if (currentSettings.delimiter !== "")
                        subheaderObj["subheaderLine" + i] = subheaderObj["subheaderLine" + i].split(currentSettings.delimiter);
                }
                content = lines.join('\n');
            }

            //
            const parsedData = Papa.parse(content, papaSettings);
            if (parsedData.errors.length === 0) {
                const newDataRaw = parsedData.data;
                const numCols = parsedData.meta.fields.length;
                const result = {
                    content: {},
                    rows: newDataRaw.length,
                };

                for (let i = 0; i < numCols; i++) {
                    const colName = parsedData.meta.fields[i];
                    result.content[colName] = _.pluck(newDataRaw, colName);
                }
                if (currentSettings.nb_meta_lines > 0) {
                    result.meta = metaObj;
                }
                if (currentSettings.nb_subheader_lines > 0) {
                    result.subheader = subheaderObj;
                }

                return result;
            } else {
                if (!_.isUndefined(parsedData.errors[0].row))
                    swal("Parser error : " + parsedData.errors[0].type, parsedData.errors[0].message + " in line '" + parsedData.errors[0].row + "' of " + currentSettings.data_path + "'.", "error");
                else
                    swal("Parser error : " + parsedData.errors[0].type, parsedData.errors[0].message + " in '" + currentSettings.data_path + "'.", "error");
                return null; 
            }
        };
    };

    self.isFileParsingSuccess = function () {
      pointerPos = 0; //AEF: reset values when update
      statusCallback('Pending');
      parserResults = self.parseFileContent();
      if (parserResults == badResult) {
        // case of bad parse at edition
        statusCallback('Error', 'Error in file parse');
        return false;
      } else {
        pastSettings = currentSettings;
        return true;
      }
    };

    self.isSettingNameChanged = function (newName) {
      if (currentSettings.name != newName) return true;
      else return false;
    };

    //AEF
    this.isSettingSampleTimeChanged = function (newSampleTime) {
      if (currentSettings.sampleTime != newSampleTime) return true;
      else return false;
    };

    self.getSavedSettings = function () {
      return [pastStatus, pastSettings];
    };

    /* This is some function where I'll get my data from somewhere */
    function getData() {
      for (var i = 0; i < numCols; i++) {
        if (currentSettings.nb_meta_lines > 0 || currentSettings.nb_subheader_lines > 0) {
          newData[colNames[i]] = parserResults.content[colNames[i]][pointerPos];
        } else {
          newData[colNames[i]] = parserResults[colNames[i]][pointerPos];
        }
      }
      if (pointerPos < numRows - 1) {
        pointerPos++;
      } else {
        if (currentSettings.playback) {
          pointerPos = 0;
        }
      }
      pastStatus = 'OK';
      statusCallback('OK');
      var dataObj = {};
      if (currentSettings.nb_meta_lines > 0) {
        dataObj.content = newData;
        dataObj.meta = parserResults.meta;
      }
      if (currentSettings.nb_subheader_lines > 0) {
        dataObj.content = newData;
        dataObj.subheader = parserResults.subheader;
      }

      if (currentSettings.nb_meta_lines > 0 || currentSettings.nb_subheader_lines > 0) {
        updateCallback(dataObj);
      } else {
        updateCallback(newData); //AEF: always put statusCallback before updateCallback. Mandatory for scheduler.
      }
    }

    // **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datanode
    self.updateNow = function () {
      //AEF TODO: maybe think in the future the need to reset pointerPos when click on refresh
      //     pointerPos = 0;

      getData();
      return true;
    };

    // **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
    self.onDispose = function () {};

    self.isSetValueValid = function () {
      return false;
    };

    self.isSetFileValid = function () {
      return true;
    };

    self.isInternetNeeded = function () {
      return false;
    };

    self.parseFileContent = function () {
      papaSettings = {
        delimiter: currentSettings.delimiter,
        newline: currentSettings.eol,
        quoteChar: currentSettings.quote_char,
        header: currentSettings.head,
        dynamicTyping: currentSettings.dynamic_typing,
        skipEmptyLines: currentSettings.skip_empty_lines,
      };

      var metaObj = {};
      var subheaderObj = {};
      var content = currentSettings.content;

      if (!_.isUndefined(content)) {
        if (_.isUndefined(currentSettings.nb_meta_lines)) {
          currentSettings.nb_meta_lines = 0;
        }
        if (_.isUndefined(currentSettings.nb_subheader_lines)) {
          currentSettings.nb_subheader_lines = 0;
        }

        if (currentSettings.nb_meta_lines > 0) {
          let lines = content.split('\n');
          var meta = lines.splice(0, currentSettings.nb_meta_lines);
          for (let i = 0; i < meta.length; i++) metaObj['metaLine' + i] = meta[i];
          content = lines.join('\n');
        }
        if (currentSettings.nb_subheader_lines > 0) {
          let lines = content.split('\n');
          var subheader = lines.splice(1, currentSettings.nb_subheader_lines);
          for (let i = 0; i < subheader.length; i++) {
            subheaderObj['subheaderLine' + i] = subheader[i];
            if (currentSettings.delimiter !== '')
              subheaderObj['subheaderLine' + i] = subheaderObj['subheaderLine' + i].split(currentSettings.delimiter);
          }
          content = lines.join('\n');
        }

        self.parserResults = Papa.parse(content, papaSettings);
        if (self.parserResults.errors.length == 0) {
          var newDataRaw = self.parserResults.data;
          numCols = self.parserResults.meta.fields.length;
          parserResults = {};
          newData = {};
          if (numCols > 0) {
            numRows = newDataRaw.length;
          }

          for (let i = 0; i < numCols; i++) {
            var colName = self.parserResults.meta.fields[i];

            parserResults[colName] = _.pluck(newDataRaw, colName);
            colNames[i] = colName;
          }
          if (currentSettings.nb_meta_lines > 0) {
            parserResults.content = parserResults;
            parserResults.meta = metaObj;
          }
          if (currentSettings.nb_subheader_lines > 0) {
            parserResults.content = parserResults;
            parserResults.subheader = subheaderObj;
          }

          return parserResults;
        } else {
          if (!_.isUndefined(self.parserResults.errors[0].row))
            swal(
              'Parser error : ' + self.parserResults.errors[0].type,
              self.parserResults.errors[0].message +
                " in line '" +
                self.parserResults.errors[0].row +
                "' of " +
                currentSettings.data_path +
                "'.",
              'error'
            );
          else
            swal(
              'Parser error : ' + self.parserResults.errors[0].type,
              self.parserResults.errors[0].message + " in '" + currentSettings.data_path + "'.",
              'error'
            );
          return badResult;
        }
      } else return badResult;
    };

    self.setFile = function (newContent) {
      currentSettings.content = newContent;
      currentSettings.data_path = newContent.name; //AEF: fix big update the path in the data settings
      return self.isFileParsingSuccess();
    };

    // Parse file
    parserResults = self.parseFileContent();
    if (parserResults == badResult) {
      // case of bad parse at creation
      error = true;
    } else {
      error = false; // reset error flag
    }
  };
})();
