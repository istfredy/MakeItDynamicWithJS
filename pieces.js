/*
    Author:  th3fr3dy <
    Date:    2023-11-24
    License: MIT
    Description: Make your webapp more dynamic using JavaScript
*/

import { addListenerAvis, addListenerSendAvis, displayChartReviews } from "./avis.js"


let getArticles = localStorage.getItem("pieces-autos")

if (getArticles === null) {

    const getArticles = await fetch("http://localhost:8081/pieces").then(getArticles => getArticles.json())

    const stringifyArticles = JSON.stringify(getArticles)

    localStorage.setItem("pieces-autos", stringifyArticles)

} else {
    getArticles = JSON.parse(getArticles)
}
addListenerSendAvis()



/* Create article html elements using literal-string */
const articleTemplate = (article) => {
    return `
    <article>
        <img src="${article.image}" alt="${article.nom}">
        <h2>${article.nom}</h2>
        <p>Price : ${article.prix} ${article.prix < 35 ? "€€" : "€€€" }</p>
        <p>${article.categorie ?? "(No category 😕)"}</p>
        <button data-id="${article.id}">Show reviews 🙈</button>
        <p class="avis"></p>
    </article>
    `
}


/* DOM generation function */
const generateArticleDOM = (fiches, articleContainer) => {
    fiches.innerHTML = ""
    for (const article of articleContainer) {
        fiches.innerHTML += articleTemplate(article)
    }

    addListenerAvis()
}



/* Append elements to the DOM */
const fiches = document.querySelector(".fiches")

generateArticleDOM(fiches, getArticles)


/* Sort by price */
const btn_sort = document.querySelector(".btn-trier")

btn_sort.addEventListener("click", () => {
    const reOder = Array.from(getArticles)
    reOder.sort((a, b) => {
        return a.prix - b.prix
    })

    generateArticleDOM(fiches, reOder)
})


/* Filter by affordable price */
const btn_filter = document.querySelector(".btn-filtrer")

btn_filter.addEventListener("click", () => {
    const affordable = getArticles.filter(article => article.prix <= 35)
    generateArticleDOM(fiches, affordable)
})



/* Filter using input range */
const rng_filter = document.querySelector(".filterbyprice")

rng_filter.addEventListener("change", () => {
    const affordable = getArticles.filter(article => article.prix <= rng_filter.value)
    generateArticleDOM(fiches, affordable)
})


/* Update piece in localStorage */
const updateArticlesBtn = document.querySelector(".update-articles")

updateArticlesBtn.addEventListener("click", () => {
    localStorage.removeItem("pieces-autos")
})

await displayChartReviews()

const displayChartByDisponibility = () => {
    const getDisponibilityCount = [0, 0]

    for (const article of getArticles) {

        article.disponibility ? getDisponibilityCount[0]++ : getDisponibilityCount[1]++
    }

    const labels = ["Available", "Unavailable"]

    const data = { 
        labels : labels,
        datasets : [{
                label : "Disponibility Stat",
                backgroundColor : "#808080",
                data : getDisponibilityCount
            }]
    }
    
    const config = {
        type : "bar",
        data : data
    }

    const displayChart = new Chart(
        document.querySelector("#graph-canvas-dispo"),
        config
    )
}

displayChartByDisponibility()