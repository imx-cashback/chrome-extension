document.addEventListener('DOMContentLoaded', () => {
    init()
})

function init() {
    chrome.storage.sync.get(['imx_cashback_address'], function (result) {

        if (result.imx_cashback_address === undefined) {
            document.querySelector('#address').value = ''
        } else {
            document.querySelector('#address').value = result.imx_cashback_address
        }
    })

    document.querySelector('#save').addEventListener('click', save)
}

function save() {

    const address = document.querySelector('#address').value

    if (address !== '') {
        fetch(`https://api.x.immutable.com/v1/users/${address}`)
            .then(response => response.json())
            .then(data => {
                if (data.code) {
                    document.querySelector('#message-container').innerHTML = `<p class="message" style="color: #d93025;">Error, verify your address.</p>`
                } else {
                    chrome.storage.sync.set({imx_cashback_address: address}, function () {
                        console.log('Value is set to ' + address);
                    });
                    document.querySelector('#message-container').innerHTML = `
                    <p class="message" style="color: green;">Saved!</p>`
                }
            })
            .catch(error => {
            })
    }
}