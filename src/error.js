class CallForError extends Error {
    constructor (props){
        super(props.message);
        this.name = props.name || this.constructor.name;
        this.status = props.code || null;
    }

    statusCode(){
        return this.status;
    }
    
    name(){
        return this.name;
    }
}

module.exports = CallForError