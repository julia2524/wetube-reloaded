const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const comments = document.querySelectorAll(".video__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.className = "video__delete-btn";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  span2.addEventListener("click", deleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    textarea.value = "";
    addComment(text, newCommentId);
  }
};

const deleteComment = async (event) => {
  const comment = event.target.closest(".video__comment");
  const { id } = comment.dataset;
  console.log(id);
  const response = await fetch(`/api/comments/${id}/comment`, {
    method: "DELETE",
  });
  if (response.ok) {
    comment.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (comments) {
  comments.forEach((comment) => {
    const deleteBtn = comment.querySelector(".video__delete-btn");
    deleteBtn.addEventListener("click", deleteComment);
  });
}
