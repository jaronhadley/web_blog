// unhide comment form to allow for a comment
const addComment = (event) => {
    event.preventDefault();
    const commentForm = document.getElementById('comment-form');
    const commentBtn = document.getElementById('comment-start');
    commentForm.classList.remove("form-hide")
    commentBtn.classList.add("form-hide")
};
// create comment
const leaveComment = async (event) => {
    event.preventDefault();
    const contents = document.querySelector('#comment-content').value.trim();
    const commentForm = document.getElementById('comment-form');
    const commentBtn = document.getElementById('comment-start');

    console.log(contents)
    const post_id = window.location.pathname.split('/')[2];
    console.log(post_id)
    if(contents) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify( {contents, post_id} ),
            headers: {
              'Content-Type': 'application/json',
            },  
        });
        if (response.ok) {
            document.location.replace(window.location.pathname);
            console.log(post_id)
            commentForm.classList.add("form-hide")
            commentBtn.classList.remove("form-hide")
          } else {
            alert('Failed to create comment');
          }
    }

}
// delete comment
const deleteComment = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');
        const post_id = window.location.pathname.split('/')[2];

        const response = await fetch(`/api/comments/${id}`, {
          method: 'DELETE',
        });
    
        if (response.ok) {
          document.location.replace(window.location.pathname);
        } else {
          alert('Failed to delete post');
        }
      }
};

document.getElementById('comment-btn').addEventListener('click', addComment);

document
  .querySelector('.new-post-form')
  .addEventListener('submit', leaveComment);

if(document.querySelector('#delete-btn')){
    document
        .querySelector('.comment-list')
        .addEventListener('click', deleteComment);
}
