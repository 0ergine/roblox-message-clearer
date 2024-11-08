// paste the code below into your console!!!
(async () => {
    var packets = []
    var pages = 500
    var page = 0
    
    // seconds!!!
    var message_delay = 1 // mir doch jetzt auch egal du hurensohn
    var archive_delay = 1

    while (page <= pages) {
        await new Promise(resolve => setTimeout(resolve, (message_delay * 1000)))
        await fetch("https://privatemessages.roblox.com/v1/messages?messageTab=inbox&pageNumber=" + page.toString(), {   
            credentials: "include",
            method: "GET",
        }).then(async (res) => {
            const rawdata = await res.json()

            const collection = rawdata.collection
            const totalPages = rawdata.totalPages

            var rawbody = {messageIds: []}
            for (var i in collection) {
                rawbody.messageIds.push(collection[i].id)
            }
            packets.push(rawbody)

            pages = totalPages  
            const percentage = (page / pages) * 100       
            const secondsleft = (pages - page) * message_delay
            page += 1 

            console.log( percentage.toFixed(1) + "% complete (≈" + secondsleft.toFixed() + "s left)" )
        })    
    }

    console.log("finished scraping ids")

    const start = packets.length
    while (packets.length > 0) {
        for (var i in packets) {
            await new Promise(resolve => setTimeout(resolve, (archive_delay * 1000)))
            await fetch("https://privatemessages.roblox.com/v1/messages/archive", {  
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": Roblox.XsrfToken.getToken()
                },
                body: JSON.stringify(packets[i]),
                method: "POST",
            }).then(async (res) => {
                if (await res.status == 200) {
                    packets.pop(i)

                    const percentage = 100 - (packets.length / start) * 100
                    const secondsleft = packets.length * archive_delay

                    console.log( percentage.toFixed(1) + "% complete (≈" + secondsleft.toFixed() + "s left)" )
                } else {
                    console.log(await res.text())
                }
            })
        }
    }
})()
