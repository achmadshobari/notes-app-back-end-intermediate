const ClientError = require("../../exceptions/ClientError");

class NotesHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postNoteHandler = this.postNoteHandler.bind(this);
        this.getNotesHandler = this.getNotesHandler.bind(this);
        this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
        this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
        this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
    }
    
    postNoteHandler(request, h){
      try {
        this._validator.validateNotePayload(request.payload);

        const {title = 'untitled', body, tags} = request.payload;
    
        const noteId= this._service.addNote({title, body, tags});
    
        const response = h.response({
            status : 'success',
            message : 'Catatan berhasil ditambahkan',
            data : {
                noteId,
            },
        });
    
        response.code(201);
        return response;
    
      } catch (error) {
        if(error instanceof ClientError){
          const response = h.response({
            status : 'fail',
            message : error.message,
          });
          response.code(400);
          return response;
        }

        // server error
        const response = h.response({
          status : 'error',
          message :'Maaf terjadi kegagalan pada server kami.',
        });

        response.code(500);
        console.error(error);
        return response;
      }
    
    }

    getNotesHandler(){
        const notes = this._service.getNotes();
        return {
            status: 'success',
            data:{
                notes,
            },
        };
    }

    getNoteByIdHandler(request, h){
      try{
        const {id} = request.params;
        const note = this._service.getNoteById(id);
        return {
            status : 'success',
            data : {
                note,
            },
        };
      }catch(error){
        const response = h.response({
            status :'fail',
            message : error.message,
        });
        response.code(404);
        return response;
      }
    }

    putNoteByIdHandler(request, h){
      this._validator.validateNotePayload(request.payload);

      try{
        const {id } = request.params;
    
        this._service.editNoteById(id, request.payload);
    
        return {
            status:'success',
            messgae:'Catatan berhasil diperbarui',
        };
      }catch(error){
        const response = h.response({
            status:'fail',
            message:error.message,
        });
        response.code(404);
        return response;
      }
    }

    deleteNoteByIdHandler(request, h){
      try{
        const {id} = request.params;
        this._service.deleteNoteById(id);
        return {
            status: 'success',
            message: 'Catatan berhasil dihapus',
        }
      }catch(error){
        const response=h.response({
            status : 'fail',
            message : error.message,
        });
        response.code(404);
        return response;
    
      }
    
    }
}

module.exports = NotesHandler;
