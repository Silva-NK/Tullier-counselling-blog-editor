document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("blogForm");
    const clearBtn = document.querySelector(".clear-btn");

    const tablePopup = document.getElementById("popupTable");
    const tableCloseBtn = tablePopup.querySelector(".close-btn");
    const tableBody = document.getElementById("tableBody");

    const editPopup = document.getElementById("popupForm");
    const editCloseBtn = editPopup.querySelector(".close-btn");


    function getPosts() {
        fetch("http://localhost:3000/posts")
            .then(response => response.json())
            .then(posts => populateTable(posts))
            .catch(error => console.error("Error fetching posts:", error));
    }


    function populateTable(posts) {
        tableBody.innerHTML = "";
        posts.forEach((post,index) => {
            const row = document.createElement("tr");

            const serialCol = document.createElement("td");
            serialCol.textContent = index + 1;

            const titleCol = document.createElement("td");
            titleCol.textContent = post.title.length > 15 ? post.title.substring(0, 15) + "..." : post.title;

            const categoryCol = document.createElement("td");
            categoryCol.textContent = post.category;

            const authorCol = document.createElement("td");
            authorCol.textContent = post.author;

            const imgCol = document.createElement("td");
            imgCol.textContent = post.img.length > 15 ? post.img.substring(0, 15) + "..." : post.img;

            const timeStampCol = document.createElement("td");
            timeStampCol.textContent = post.timeStamp;

            const contentCol = document.createElement("td");
            contentCol.textContent = post.content.length > 50 ? post.content.substring(0, 50) + '...': post.content;

            const actionsCol = document.createElement("td");
            actionsCol.classList.add("actions");

            const editBtn = document.createElement("button");
            editBtn.classList.add("bx", "bxs-edit");
            editBtn.setAttribute("data-tooltip", "Edit");
            editBtn.onclick = () => editPost(post);

            const viewBtn = document.createElement("button");
            viewBtn.classList.add("bx", "bx-detail");
            viewBtn.setAttribute("data-tooltip", "View");
            viewBtn.onclick = () => openViewPopup(post);

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("bx", "bxs-trash");
            deleteBtn.setAttribute("data-tooltip", "Delete");

            deleteBtn.onclick = function () {
                deletePost(post);
            };

            actionsCol.append(editBtn, viewBtn, deleteBtn);

            row.append(serialCol, titleCol, categoryCol, authorCol, imgCol, timeStampCol, contentCol, actionsCol);
            tableBody.appendChild(row);
        });
    }


    document.getElementById("blogTableBtn").addEventListener("click", () => {
        tablePopup.style.visibility = "visible";
        tablePopup.style.opacity = "1";
        getPosts();
    });


    tableCloseBtn.addEventListener("click", () => {
        tablePopup.style.visibility = "hidden";
        tablePopup.style.opacity = "0";

    });


    form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        const now = new Date();
        const timeStamp = now.toLocaleString();

        const blogData = {
            title: form.title.value,
            category: form.category.value,
            author: form.author.value,
            img: form.img.value,
            timeStamp,
            content: form.content.value
        };
        
        fetch("http://localhost:3000/posts", {
            method: "POST",
            headers:{
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(blogData)
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
        })
        .catch(error => console.error("Error fetching posts: ", error));
    });


    clearBtn.addEventListener("click", () => {
        form.reset();
    });

    const previewBtn = document.querySelector(".preview-btn");

    previewBtn.addEventListener("click", () => {
        const title = form.title.value.trim();
        const category = form.category.value.trim();
        const author = form.author.value.trim();
        const img = form.img.value.trim() || "images/default.png";
        const content = document.querySelector(".editor-content").value.trim();

        if (!title || !category || !author || !content) {
            alert("Please fill in all fields before previewing.");
            return;
        }

        const previewData = { title, category, author, img, content };

        openPreviewPopup(previewData);
    });


    function displayLatestPost() {
        fetch("http://localhost:3000/posts")
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0) return;
    
                const latestPost = posts[posts.length - 1];
    
                document.getElementById("latest-title").textContent = latestPost.title;
                document.getElementById("latest-author").textContent = latestPost.author;
                document.getElementById("latest-date").textContent = formatDateTime(latestPost.timeStamp);
                document.getElementById("latest-content").textContent = latestPost.content.length > 500 ? latestPost.content.substring(0, 500) + "..." : latestPost.content;
                document.getElementById("latest-link").href = `post.html?id=${latestPost.id}`;
                document.querySelector("#latest-img img").src = latestPost.img || "images/Blog-4.png";

                const viewBtn = document.getElementById("latest-link");
                if (viewBtn) {
                    viewBtn.onclick = (event) => {
                        event.preventDefault();
                        openViewPopup(latestPost);
                    };
                } else {
                    console.error("View button not found!");
                }

                const editBtn = document.querySelector(".latest-actions .edit-btn");
                console.log("Edit button found:", editBtn);
                if (editBtn) {
                    editBtn.onclick = () => editPost(latestPost);
                } else {
                    console.error("Edit button not found!");
                }

                const deleteBtn = document.querySelector(".latest-actions .delete-btn");
                console.log("Delete button found:", deleteBtn);
                if (deleteBtn) {
                    deleteBtn.onclick = () => deletePost(latestPost);
                } else {
                    console.error("Delete button not found!");
                }
            })
            .catch(error => console.error("Error fetching latest post:", error));
    }


    function formatDateTime(timestamp) {
        const [datePart, timePart] = timestamp.split(", ");

        const [day, month, year] = datePart.split("/").map(Number);

        const [hour, minute, second] = timePart.split(":").map(Number);

        const date = new Date(year, month - 1, day, hour, minute, second);

        if (isNaN(date.getTime())) {
            console.error("Invalid timestamp:", timestamp);
            return "Invalid Date";
        }

        const formattedTime = date.toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });


        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });


        return `${formattedTime}, ${formattedDate}`;
    }


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    function displayRandomPosts() {
        fetch("http://localhost:3000/posts")
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0) return;
    
                const shuffledPosts = shuffleArray(posts);
    
                const selectedPosts = shuffledPosts.slice(0, 3);
    
                const wrapper = document.querySelector(".wrapper");

                setTimeout(() => {
                    wrapper.innerHTML = "";
    
                    selectedPosts.forEach(post => {
                        const blogItem = document.createElement("div");
                        blogItem.classList.add("blog-item");

                        const img = document.createElement("img");
                        img.src = post.img || "images/Blog-4.png";
                        img.alt = post.title;
                        blogItem.appendChild(img);

                        const title = document.createElement("h2");
                        title.textContent = post.title;
                        blogItem.appendChild(title);

                        const blogMeta = document.createElement("div");
                        blogMeta.classList.add("blog-meta");

                        const author = document.createElement("span");
                        author.classList.add("author");
                        author.textContent = `By ${post.author}`;

                        const category = document.createElement("span");
                        category.classList.add("category");
                        category.textContent = post.category;

                        const date = document.createElement("span");
                        date.classList.add("date");
                        date.textContent = formatDateTime(post.timeStamp);

                        blogMeta.append(author, category, date);
                        blogItem.appendChild(blogMeta);

                        const ratingDiv = document.createElement("div");
                        ratingDiv.classList.add("rating");
                        for (let i = 0; i < 5; i++) {
                            const star = document.createElement("i");
                            star.classList.add("bx", "bxs-star", "star");
                            ratingDiv.appendChild(star);
                        }
                        blogItem.appendChild(ratingDiv);

                        const content = document.createElement("p");
                        content.textContent = post.content.length > 250 ? post.content.substring(0, 250) + "..." : post.content;
                        blogItem.appendChild(content);

                        const readMore = document.createElement("a");
                        readMore.href = "#";
                        readMore.classList.add("btn");
                        readMore.textContent = "Read";
                        readMore.onclick = (event) => {
                            event.preventDefault();
                            openViewPopup(post);
                        };
                        blogItem.appendChild(readMore);

                        const editBtn = document.createElement("button");
                        editBtn.classList.add("edit-btn");

                        const editIcon = document.createElement("i");
                        editBtn.classList.add("bx", "bx-edit");

                        editBtn.append(editIcon, " Edit");
                        editBtn.onclick = () => editPost(post);
                        
                        const deleteBtn = document.createElement("button");
                        deleteBtn.classList.add("delete-btn");

                        const deleteIcon = document.createElement("i");
                        editBtn.classList.add("bx", "bx-trash");

                        deleteBtn.append(deleteIcon, " Delete");
                        deleteBtn.onclick = () => deletePost(post);
                        
                        const actionsDiv = document.createElement("div");
                        actionsDiv.classList.add("blog-actions");

                        actionsDiv.append(editBtn, deleteBtn);
                        blogItem.appendChild(actionsDiv);
                        wrapper.appendChild(blogItem);
                    });
                })
            }, 10)
            .catch(error => console.error("Error fetching posts:", error));
    }


    function editPost(post) {
        console.log("Editing post:", post);
    
        const titleInput = document.getElementById("edit-title");
        const categoryInput = document.getElementById("edit-category");
        const authorInput = document.getElementById("edit-author");
        const imgInput = document.getElementById("edit-img");
        const contentInput = document.getElementById("editor-content");
        
        titleInput.value = post.title;
        categoryInput.value = post.category;
        authorInput.value = post.author;
        imgInput.value = post.img;
        contentInput.value = post.content;

        const editPopup = document.getElementById("popupForm");
        if (editPopup) {
            editPopup.style.visibility = "visible";
            editPopup.style.opacity = "1";
        } else {
            console.error("Edit popup (popupForm) not found!");
            return;
        }

        previewBtn.onclick = openPreviewPopup;
    
        const form = document.getElementById("editForm")
        form.onsubmit = function (e) {
            e.preventDefault();
    
            const updatedPost = {
                ...post,
                title: document.getElementById("edit-title").value,
                category: document.getElementById("edit-category").value,
                author: document.getElementById("edit-author").value,
                img: document.getElementById("edit-img").value,
                content: document.getElementById("editor-content").value,
            };
    
            fetch(`http://localhost:3000/posts/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPost),
            })
            .then((res) => res.json())
            .then(() => {
                alert("Post updated successfully!");
                editPopup.style.display = "none";
                location.reload();
            })
            .catch((err) => console.error("Error updating post:", err));
        };
    }

    const editClearBtn = editPopup.querySelector(".editor-buttons .clear-btn");
    
    if (editClearBtn) {
        editClearBtn.onclick = function () {
            document.getElementById("edit-title").value = "";
            document.getElementById("edit-category").value = "";
            document.getElementById("edit-author").value = "";
            document.getElementById("edit-img").value = "";
            document.getElementById("editor-content").value = "";
        };
    } else {
        console.error("Clear button (clear-btn) not found in Edit Popup!");
    }

    editCloseBtn.addEventListener("click", () => {
        editPopup.style.visibility = "hidden";
        editPopup.style.opacity = "0";
    });
    

    function deletePost(post) {
        if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
            fetch(`http://localhost:3000/posts/${post.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
                if (res.ok) {
                    alert("Post deleted successfully!");
                    location.reload();
                } else {
                    console.error("Failed to delete post");
                }
            })
            .catch((err) => console.error("Error deleting post:", err));
        }
    }
    

    function openViewPopup(post) {
        document.getElementById("view-img").src = post.img || "images/placeholder.jpg";
        document.getElementById("view-title").textContent = post.title;
        document.getElementById("view-author").textContent = post.author;
        document.getElementById("view-category").textContent = post.category;
        document.getElementById("view-date").textContent = formatDateTime(post.timeStamp);
        document.getElementById("view-content").textContent = post.content.length > 500 ? post.content.substring(0, 500) + "..." : post.content;

        document.getElementById("viewPopup").style.visibility = "visible";
        document.getElementById("viewPopup").style.opacity = "1";
    }

    document.querySelector(".close-view-btn").addEventListener("click", () => {
        document.getElementById("viewPopup").style.visibility = "hidden";
        document.getElementById("viewPopup").style.opacity = "0";
    });


    function openPreviewPopup(previewData) {
        document.getElementById("preview-img").src = previewData.img;
        document.getElementById("preview-title").textContent = previewData.title;
        document.getElementById("preview-author").textContent = previewData.author;
        document.getElementById("preview-category").textContent = previewData.category;
        document.getElementById("preview-content").textContent = previewData.content;

        document.getElementById("previewPopup").style.visibility = "visible";
        document.getElementById("previewPopup").style.opacity = "1";
    }

    document.querySelector(".close-preview-btn").addEventListener("click", () => {
        document.getElementById("previewPopup").style.visibility = "hidden";
        document.getElementById("previewPopup").style.opacity = "0";
    });

    function filterTable() {
        let searchInput = document.getElementById("searchInput").value.toLowerCase();
        let categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();
        let tableRows = document.querySelectorAll("#tableBody tr");
    
        tableRows.forEach(row => {
            let title = row.cells[1].textContent.toLowerCase();
            let category = row.cells[2].textContent.toLowerCase();
            let author = row.cells[3].textContent.toLowerCase();
    
            let titleMatch = title.includes(searchInput);
            let authorMatch = author.includes(searchInput);
            let categoryMatch = categoryFilter === "" || category === categoryFilter;
    
            row.style.display = (titleMatch || authorMatch) && categoryMatch ? "" : "none";
        });
    }
    
    

    filterTable()
    displayLatestPost();
    displayRandomPosts();

});