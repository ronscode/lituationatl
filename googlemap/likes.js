var likeButton = document.getElementById('like');
var counter = document.getElementById('counter');
var count = 0; // This variable holds the current value of the counter!

likeButton.addEventListener('click', function(){

    count++;
    counter.innerHTML = count;

    if(count == 3){
        likeButton.innerHTML = 'LIT!!';

    }else if(count == 25){

        likeButton.innerHTML = 'SUPER LIT!!';
    }
    
});