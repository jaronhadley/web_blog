// update post
const updatePost = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const contents = document.querySelector('#post-cont').value.trim();

    const post_id = window.location.pathname.split('/')[3];
    if (title && contents) {
        const response = await fetch(`/api/posts/${post_id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, contents }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
    if (response.ok) {
        document.location.replace(`/post/${post_id}`);
        } else {
        alert('Failed to update post');
        }
    }
}

document
.querySelector('.new-post-form')
.addEventListener('submit', updatePost);