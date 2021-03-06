window.PersonAdminView = Backbone.View.extend({

    initialize:function () {
        var self = this;
        this.people = new PersonCollection();
        this.people.fetch().then(function() {
            self.render();
        }, null);
    },

    render:function () {
        $(this.el).html(this.template({people:this.people}));
        //clear the add new person modal when it's closed
        $('#add-person-modal').on('hidden.bs.modal', function (e) {
            $("#new-person-name").val('');
            $("#new-person-picture").val('');
        });
        return this;
    },

    events: {
        "click #add-person-button": "addPerson",
        "click .delete-person-button": "deletePerson"
    },

    //gets info from the form and saves a new person to the database
    //then makes a new row for them
    addPerson: function() {
        var person = new Person({
            name:$("#new-person-name").val(),
            image:$("#new-person-picture").val(),
            responseRequired:$("#response-required").is(':checked')
        });
        var self= this;
        person.save({},{success: function() {
            self.people.fetch().then(function() {
                $("#person-table").append($('<tr><td>'+person.get("name")+'</td><td><img src="'+person.get('image')+'" alt="'+person.get('name')+'" width="50" height="50"></td><td><button class="btn btn-danger delete-person-button" id="delete-'+person.get('_id')+'">Delete</button></td></tr>'));
            }, null);
        }});
        $('#add-person-modal').modal('hide');
    },

    //deletes the person's row, then uses the id from the button's id to find the person model
    //and delete it from the collection
    deletePerson: function(e) {
        $(e.target).parents("tr").remove();
        this.people.get(e.target.id.substring(7)).destroy();
    }

});