
function listenForUpdates(){

    var thread = document.getElementById("thread");
    var threadContent = "";
    // A variable referencing the comments path in our db
    var commentThread = database.ref('comments/');
  
    commentThread.on('value',function(snapshot){
  
      /*
        Here we remove all existing comments from the page so every 
        time the function runs lines 37 to 40 don't duplicate the thread 
        on every db update.
      */
  
      while(thread.firstChild){
        thread.removeChild(thread.firstChild);
      }
  
      // We begin iterating through all the db entries here
      snapshot.forEach(function(entry){
  
        /*
        On every iteration we get the name of the person who left the comment
        as well as their comment and store them in some very human readable 
        variables with a naming convention that makes sense.
        We then assign our thread content variable to the html below
        and inject our new db variables as needed. We are adding a new
        set of html to our thread element on each iteration of our db snapshot
        object.
        */
        var nameFromDb = entry.val().fullName;
        var commentFromDb = entry.val().comment;
        threadContent = `<div class="comment"><h3>${nameFromDb} says: </h3>
        <p>${commentFromDb}</p></div><br>`
  
        thread.innerHTML += threadContent;
      });
    });
  };


  /*
  Here we define a function to write to our db.
  The function is invoked onclick on line 34 in group3.html.
*/
function writeUserData() {
  
    /*  
      Below we store the values that were input into our comment box
      into some variables
    */
        var firstName = document.getElementById("fname").value;
        var lastName = document.getElementById("lname").value;
        var name = `${firstName} ${lastName}`;
        var commentInput = document.getElementById("commentBox").value;
        //We created a timestamp variable to determine when the comment was created
        var timestamp = Math.floor(Date.now() / 1000);
    
        /*
        Here we check and make sure all our input boxes aren't empty.
        If they are, we return an alert prompting the user to fill in all
        boxes and then we exit the function on return to prevent empty
        strings from being added to our db.
        */
        if(firstName == "" || lastName == "" || commentInput == ""){
          alert("Please fill in all fields to leave a comment.");
          return
        }
    
        /*
          In our database we create a comments path which stores each new
          entry by it's timestamp. This is done so when the comment thread 
          is generated it returns the comments in the order they were created
          as opposed to alphabetical order(which is the firebase db default).
        */
        database.ref(`comments/${timestamp}`).set({
    
          fullName: name,
          comment: commentInput
    
        });

         /*
    Here we reset our input fields after writing to our db so the
    next user leaving the comment doesn't have to clean up after you.
  */
      commentInput= "";
      firstName = "";
      lastName = "";

  }