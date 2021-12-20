AFRAME.registerState({
    initialState: {
      variables: {}
    },
    handlers: {
        createVariable: function (state, action) {
            if(!state.variables.hasOwnProperty(action.name)){
                state.variables[action.name] = action.value||0.0;
            }else{
                console.warn('Variable with name: \''+action.name+'\' already exists, use \'setVariable\' handler to change it\'s value')
            }
        },
        deleteVariable: function (state, action) {
            delete state.variables[action.name];
        },
        setVariable: function (state, action) {
            if(state.variables.hasOwnProperty(action.name)){
                state.variables[action.name] = action.value;
            }else{
                console.warn('Variable with name: \''+action.name+'\' doesn\'t exist, use \'createVariable\' first to create it')
            }
        }
    },
});