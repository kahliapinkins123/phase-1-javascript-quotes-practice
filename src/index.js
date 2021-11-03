document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.querySelector('#quote-list');
    const form = document.querySelector('#new-quote-form');
    const quoteInput = document.querySelector('#new-quote');
    const authorInput = document.querySelector('#author');

    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(resp => resp.json())
        .then(array => {
            for (const obj of array) {
                createQuote(obj);
            }

            form.addEventListener('submit', e => {
                e.preventDefault();
                const newQuote = {
                    quote: quoteInput.value,
                    author: authorInput.value,
                    likes: []
                }

                createQuote(newQuote);

                quoteInput.value = '';
                authorInput.value = '';

                fetch('http://localhost:3000/quotes',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(newQuote)
                })

            })
        })

    function createQuote(obj) {
        const li = document.createElement('li');
        const blockquote = document.createElement('blockquote');
        const p = document.createElement('p');
        const footer = document.createElement('footer');
        const br = document.createElement('br');
        const btnSuccess = document.createElement('BUTTON');
        const span = document.createElement('span');
        const btnDanger = document.createElement('BUTTON');
        let noOfLikes = obj['likes'].length

        li.className = 'quote-card';
        blockquote.className = 'blockquote';
        p.className = 'mb-0';
        footer.className = 'blockquote-footer';
        btnSuccess.className = 'btn-success';
        btnDanger.className = 'btn-danger';

        p.textContent = obj['quote'];
        footer.textContent = obj['author'];
        btnSuccess.textContent = 'Likes: '
        span.textContent = noOfLikes;
        btnDanger.textContent = 'Delete';

        btnSuccess.appendChild(span);

        blockquote.appendChild(p);
        blockquote.appendChild(footer);
        blockquote.appendChild(br);
        blockquote.appendChild(btnSuccess);
        blockquote.appendChild(btnDanger);

        li.appendChild(blockquote);

        quoteList.appendChild(blockquote);

        btnDanger.addEventListener('click', () => {
            blockquote.innerHTML = '';

            fetch(`http://localhost:3000/quotes/${obj['id']}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
        })

        btnSuccess.addEventListener('click',()=>{
            noOfLikes++
            span.textContent = noOfLikes;

            fetch(`http://localhost:3000/likes/`,{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    quoteId: obj['id']
                })
            })
            
        })
    }

})