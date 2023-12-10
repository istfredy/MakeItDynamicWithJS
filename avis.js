
/* Add listener to get avis */
export  function addListenerAvis () {
    const getButtons = document.querySelectorAll(".fiches article button")

    for (const button of getButtons) {
        button.addEventListener("click", async (e) => {
            
            const id = e.target.dataset.id
            let getAvis = localStorage.getItem(`avis-${id}`)
            
            if (getAvis === null) {
                const avis = await fetch(`http://localhost:8081/pieces/${id}/avis`) 
                getAvis = await avis.json()

                const stringifyAvis = JSON.stringify(getAvis)
                localStorage.setItem(`avis-${id}`, stringifyAvis)
            } else {
                getAvis = JSON.parse(getAvis)
            } 

            const avisParentContainer = e.target.parentElement
            const avisContainer = avisParentContainer.querySelector(".avis")
            avisContainer.innerHTML = ""

            const avisTemplate = (avis) => {
                return `<strong>${avis.utilisateur}</strong> : ${avis.commentaire} <br> <br> `
            }

            for (const avis of getAvis) {
                avisContainer.innerHTML += avisTemplate(avis)
            }

            avisParentContainer.appendChild(avisContainer)

        })

    }
} 


/* Add listener to send avis */
export function addListenerSendAvis () {
    const getFrom = document.querySelector(".formulaire-avis")
    getFrom.addEventListener("submit", (e) => {

        e.preventDefault()

        const getAvisData = {
            pieceId : parseInt(e.target.querySelector("[name=piece-id]").value),
            utilisateur : e.target.querySelector("[name=utilisateur]").value,
            commentaire : e.target.querySelector("[name=avis]").value,
            nbEtoile : parseInt(e.target.querySelector("[name=nb-star]").value)
        }

        const avisData = JSON.stringify(getAvisData)

        fetch("http://localhost:8081/avis", {
            method : "POST",
            headers : { "Content-Type" : "application/json" },
            body : avisData
        })

        console.log(getAvisData);
    })
}

/* Display reviews stat using chartjs */

export  async function displayChartReviews () {

    const getAvis = await fetch("http://localhost:8081/avis").then(
        getAvis => getAvis.json()
    )
    
    const getStarCount = [0, 0, 0, 0, 0]
    
    for (let comment of getAvis) {
        getStarCount[comment.nbEtoiles - 1]++
    }

    /* Chartjs Configuration 📈*/

    const labels = ["1", "2", "3", "4", "5"]

    const data = { 
        labels : labels,
        datasets : [{
                label : "Reviews Stat",
                backgroundColor : "#808080",
                data : getStarCount.reverse()
            }]
    }
    
    const config = {
        type : "bar",
        data : data,
        options : {
            indexAxis : "y",
        }
    }

    const displayChart = new Chart(
        document.querySelector("#graph-canvas-review"),
        config
    )
}