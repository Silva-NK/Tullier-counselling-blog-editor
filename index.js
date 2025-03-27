document.addEventListener("DOMContentLoaded", () => {
    // getPosts();
    const form = document.getElementById("blogForm");
    const clearBtn = document.querySelector(".clear-btn");

    form.addEventListener("submit", (evt) => {
        evt.preventDefault();

        const blogData = {
            title: form.title.value,
            category: form.title.value,
            author: form.author.value,
            img: form.img.value,
            content: form.content.value
        };
        
        // function getPosts() {}
        fetch("http://localhost:3000/posts", {
            method: "POST",
            headers:{
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(blogData)
        })
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
        })
        .catch(error => console.error("Error fetching posts: ", error));

        console.log(blogData);
    })

    clearBtn.addEventListener("click", () => {
        form.reset();
    });


    const popup = document.getElementById("popupTable");
    const closeBtn = document.querySelector(".close-btn");
    const tableBody = document.getElementById("tableBody");

    document.getElementById("blogTableBtn").addEventListener("click", () => {
        popup.style.visibility = "visible";
        popup.style.opacity = "1";
    })

    closeBtn.addEventListener("click", () => {
        popup.style.visibility = "hidden";
        popup.style.opacity = "0";
    })
});