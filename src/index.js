import {Link} from "@imtbl/imx-sdk"

const link = new Link('https://link.x.immutable.com')

setTimeout(() => {
    init()
    addButton()
}, 500)

function init() {
    // add button when page change
    const target = document.querySelector('title')
    const observer = new MutationObserver(() => {
        addButton()
    })

    observer.observe(target, {
            subtree: true,
            characterData: true,
            childList: true
        }
    )
}

function addButton() {
    const buyButton = document.querySelector('button[data-testid=mainCtaButton--buyAsset]')
    // asset is on sale
    if (buyButton) {
        const buyUi = document.querySelector('div[data-testid=buyUi]')

        const cashBackBtn = document.createElement('button')
        cashBackBtn.setAttribute('class', buyButton.getAttribute('class'))
        cashBackBtn.style.marginTop = '20px'
        cashBackBtn.style.background = '#049305'
        cashBackBtn.innerHTML = 'Buy with 0.25% discount and 0.5% cashback'
        cashBackBtn.addEventListener('click', buy)

        buyUi.appendChild(cashBackBtn)
    }
}

async function getAddress() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('imx_cashback_address', value => {
                resolve(value['imx_cashback_address']);
            });
        } catch (ex) {
            reject(ex);
        }
    })
}

async function buy() {
    const asset = getCurrentAsset()
    const orderId = await fetchOrder(asset.tokenAddress, asset.assetId)

    let takerFees = [{
        percentage: 0.25,
        recipient: '0x8eefFe84c4E3B803386b4462eeeAACD623Cc8604'
    }]

    const address = await getAddress()

    if (address) {
        takerFees.push({
            percentage: 0.50,
            recipient: address
        })
    }

    await link.buy({
        orderIds: orderId,
        fees: takerFees
    }).then(() => {
        window.location.reload()
    }).catch(() => {
    })
}

async function fetchOrder(tokenAddress, assetId) {
    return fetch(`https://api.x.immutable.com/v1/orders?sell_token_address=${tokenAddress}&sell_token_id=${assetId}&status=active`)
        .then(response => response.json())
        .then(data => {
            return data.result[0].order_id
        })
        .catch(() => {
            alert('Error, please reload the page!')
        })
}

function getCurrentAsset() {
    const parameters = window.location.href.split('/')
    return {
        tokenAddress: parameters[4],
        assetId: parameters[5],
    }
}