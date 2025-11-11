
        /**
         * JavaScript for the link generator page (Consolidated & Randomized)
         */
        const QRCode = window.QRCode

        // --- Helper Functions ---
        function generateRandomUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        function generateUUID(id) {
            document.getElementById(id).value = generateRandomUUID();
        }
        function generatePassword(id) {
            // Using UUID generator for password for simplicity and randomness
            document.getElementById(id).value = generateRandomUUID();
        }
        function selectRandomDomain(domains) {
            const randomIndex = Math.floor(Math.random() * domains.length);
            return domains[randomIndex];
        }

        // --- Configuration & Initialization ---
        const serverDomains = [
            "antiquewhite.qzz.io",
            "bisque.qzz.io",
            "cornsilk.qzz.io",
            "floralwhite.qzz.io",
            "fuchsia.qzz.io",
            "ivory.qzz.io",
            "lavenderblush.qzz.io",
            "midnightblue.qzz.io",
            "sandybrown.qzz.io",
            "seashell.qzz.io",
            "thistle.qzz.io"
        ];
        
        // ** MODIFIKASI INTI: Pilih domain acak saat inisialisasi **
        let selectedServerDomain = selectRandomDomain(serverDomains);
        
        const API_STATUS_URL = "https://api.jb8fd7grgd.workers.dev";
        const defaultProxyUrl = "https://raw.githubusercontent.com/AFRcloud/ProxyList/refs/heads/main/ProxyList.txt"
        const itemsPerPage = 10
        let currentPage = 1
        const pathTemplate = "/{ip}:{port}"
        let proxyList = []
        let filteredProxyList = []
        let selectedProxy = null

        const urlList = [
            "zoomgov.com", "dev.appsflyer.com", "go.appsflyer.com", "cdn.customlinks.appsflyer.com", "add.customlinks.appsflyer.com", 
            "ava.game.naver.com", "df.game.naver.com", "quiz.int.vidio.com", "quiz.staging.vidio.com", "nontontv.vidio.com", 
            "quiz.vidio.com", "img.email1.vidio.com", "img.email2.vidio.com", "img.email3.vidio.com", "support.zoom.us", 
            "source.zoom.us", "zoomgov", "blog.webex.com", "edu.ruangguru.com", "gw.ruangguru.com", 
            "bimbel.ruangguru.com", "blog.ruangguru.com", "roboguru.ruangguru.com", "io.ruangguru.com", "open.spotify.com", 
            "investors.spotify.com", "investor.fb.com", "cache.netflix.com", "npca.netflix.com", "creativeservices.netflix.com", 
            "help.viu.com", "www.udemy.com", "info.udemy.com", "teaching.udemy.com", "zaintest.vuclip.com", 
            "space.byu.id", "grabacademyportal.grab.com", "grabalumni.grab.com", "app-stg.gopay.co.id", "app.gopay.co.id", 
            "hurricane.lipcon.com", "www.lipcon.com", "investor.medallia.com", "go.medallia.com", "app.midtrans.com", 
            "www.midtrans.com", "api.midtrans.com", "dashboard.midtrans.com", "account-gopay.midtrans.com", "s.shopee.co.id", 
            "cf.shopee.co.id", "s.lazada.co.id", "store.linefriends.com", "collection.linefriends.com", "help.line.me", 
            "api24-normal.tiktokv.com", "api24-normal-useast1a.tiktokv.com", "api24-normal-alisg.tiktokv.com"
        ];
        
        const bugOptions = [
            { value: "", label: "Default" },
            { value: "manual", label: "Input Manual" }, // Add manual option
            ...urlList.map(url => ({ value: url, label: url }))
        ];

        // DOM elements (Simplified)
        const proxyListSection = document.getElementById("proxy-list-section")
        const accountCreationSection = document.getElementById("account-creation-section")
        const resultSection = document.getElementById("result-section")
        const loadingIndicator = document.getElementById("loading-indicator")
        const proxyListContainer = document.getElementById("proxy-list-container")
        const noProxiesMessage = document.getElementById("no-proxies-message")
        const customUrlInput = document.getElementById("custom-url-input")
        const proxyUrlInput = document.getElementById("proxy-url")
        const paginationContainer = document.getElementById("pagination-container")
        const proxyCountInfo = document.getElementById("proxy-count-info")
        const searchInput = document.getElementById("search-input")
        const donationModal = document.getElementById('donation-modal');
        const donationButton = document.getElementById('donation-button');
        const closeDonation = document.getElementById('close-donation');


        // --- UI Logic Functions ---
        
        function showProxyListSection() {
            proxyListSection.classList.remove("hidden")
            accountCreationSection.classList.add("hidden")
            resultSection.classList.add("hidden")
        }

        function showAccountCreationSection() {
            proxyListSection.classList.add("hidden")
            accountCreationSection.classList.remove("hidden")
            resultSection.classList.add("hidden")
        }

        function populateBugOptions() {
            const bugSelects = [
                document.getElementById("vless-bug"),
                document.getElementById("trojan-bug"),
                document.getElementById("ss-bug"),
            ]
            bugSelects.forEach((select) => {
                if (select) {
                    select.innerHTML = ""
                    bugOptions.forEach((option) => {
                        const optionElement = document.createElement("option")
                        optionElement.value = option.value
                        optionElement.textContent = option.label
                        select.appendChild(optionElement)
                    })
                }
            })
        }

        // --- Core App Logic ---

        function processProxyData(text) {
            const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "")
            
            if (lines.length === 0) {
                noProxiesMessage.classList.remove("hidden")
                return
            }

            let delimiter = ","
            const firstLine = lines[0]
            if (firstLine.includes("\t")) {
                delimiter = "\t"
            } else if (firstLine.includes("|")) {
                delimiter = "|"
            } else if (firstLine.includes(";")) {
                delimiter = ";"
            }

            proxyList = lines
                .map((line) => {
                    const parts = line.split(delimiter)
                    if (parts.length >= 2) {
                        return {
                            ip: parts[0].trim(),
                            port: parts[1].trim(),
                            country: parts.length >= 3 ? parts[2].trim() : "Unknown",
                            provider: parts.length >= 4 ? parts[3].trim() : "Unknown Provider",
                        }
                    }
                    return null
                })
                .filter((proxy) => proxy && proxy.ip && proxy.port)

            if (proxyList.length === 0) {
                noProxiesMessage.classList.remove("hidden")
                displayFallbackProxyList()
                return
            }

            currentPage = 1
            filteredProxyList = [...proxyList]
            renderProxyList()
        }

        function displayFallbackProxyList() {
            proxyList = [{ ip: "103.6.207.108", port: "8080", country: "ID", provider: "PT Pusat Media Indonesia" }]
            filteredProxyList = [...proxyList]
            renderProxyList()
        }

        function loadProxyList(url) {
            loadingIndicator.classList.remove("hidden")
            proxyListContainer.innerHTML = ""
            noProxiesMessage.classList.add("hidden")

            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch proxy list")
                    }
                    return response.text()
                })
                .then((data) => {
                    processProxyData(data)
                    loadingIndicator.classList.add("hidden")
                })
                .catch((error) => {
                    console.error("Error loading proxy list:", error)
                    loadingIndicator.classList.add("hidden")
                    noProxiesMessage.classList.remove("hidden")
                    displayFallbackProxyList()
                })
        }

        function checkProxyStatusInList(proxy, statusBadge) {
            fetch(`${API_STATUS_URL}/${proxy.ip}:${proxy.port}`)
                .then((response) => response.json())
                .then((data) => {
                    const proxyData = Array.isArray(data) ? data[0] : data

                    if (proxyData && proxyData.proxyip === true) {
                        statusBadge.className = "inline-block w-3 h-3 rounded-full bg-emerald-500 ml-2"
                        statusBadge.title = "Aktif"
                    } else {
                        statusBadge.className = "inline-block w-3 h-3 rounded-full bg-rose-500 ml-2"
                        statusBadge.title = "Mati"
                    }
                })
                .catch((error) => {
                    statusBadge.className = "inline-block w-3 h-3 rounded-full bg-amber-500 ml-2"
                    statusBadge.title = "Tidak diketahui"
                    console.error("Error checking proxy status:", error)
                })
        }
        
        function renderProxyList() {
            proxyListContainer.innerHTML = ""

            if (filteredProxyList.length === 0) {
                noProxiesMessage.classList.remove("hidden")
                paginationContainer.innerHTML = ""
                proxyCountInfo.textContent = ""
                return
            }

            noProxiesMessage.classList.add("hidden")

            const totalPages = Math.ceil(filteredProxyList.length / itemsPerPage)
            const startIndex = (currentPage - 1) * itemsPerPage
            const endIndex = Math.min(startIndex + itemsPerPage, filteredProxyList.length)
            const currentItems = filteredProxyList.slice(startIndex, endIndex)

            currentItems.forEach((proxy, index) => {
                const actualIndex = startIndex + index
                const card = document.createElement("div")
                card.className = "proxy-card group flex justify-between items-center"

                const infoDiv = document.createElement("div")
                infoDiv.className = "flex-1 min-w-0 pr-2"

                const providerContainer = document.createElement("div")
                providerContainer.className = "flex items-center w-full relative"

                const providerName = document.createElement("div")
                providerName.className = "font-medium text-sm truncate group-hover:text-indigo-300 transition-colors"
                providerName.style.maxWidth = "calc(100% - 20px)"
                providerName.textContent = proxy.provider
                providerContainer.appendChild(providerName)

                const statusBadge = document.createElement("span")
                statusBadge.className = "inline-block w-3 h-3 rounded-full bg-gray-500 ml-2 pulse-animation"
                statusBadge.style.flexShrink = "0"
                statusBadge.title = "Memeriksa..."
                statusBadge.id = `proxy-status-${actualIndex}`
                providerContainer.appendChild(statusBadge)
                infoDiv.appendChild(providerContainer)

                const detailsDiv = document.createElement("div")
                detailsDiv.className = "text-xs text-gray-400 mt-1 truncate group-hover:text-gray-300 transition-colors"
                detailsDiv.textContent = `${proxy.country} | ${proxy.ip}:${proxy.port}`
                infoDiv.appendChild(detailsDiv)

                const button = document.createElement("button")
                button.className = "primary-btn py-2 px-3 rounded-lg text-xs flex-shrink-0"
                button.style.whiteSpace = "nowrap"
                button.setAttribute("data-index", actualIndex)
                button.innerHTML = 'Create <i class="fas fa-arrow-right ml-1"></i>'
                button.addEventListener("click", function () {
                    const idx = Number.parseInt(this.getAttribute("data-index"))
                    selectProxy(idx)
                    showAccountCreationSection()
                })

                card.appendChild(infoDiv)
                card.appendChild(button)
                proxyListContainer.appendChild(card)

                checkProxyStatusInList(proxy, statusBadge)
            })

            renderPagination(totalPages)
            proxyCountInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${filteredProxyList.length} proxies`
        }

        function renderPagination(totalPages) {
            paginationContainer.innerHTML = ""
            if (totalPages <= 1) return
            // Simplified pagination rendering for brevity, keeping only essential buttons
            
            const prevBtn = document.createElement("button")
            prevBtn.className = `secondary-btn px-3 py-1 mx-1 rounded-lg text-sm ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'
            prevBtn.disabled = currentPage === 1
            prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderProxyList(); } })
            paginationContainer.appendChild(prevBtn)

            const pageInfo = document.createElement("span")
            pageInfo.className = "text-sm text-white mx-2"
            pageInfo.textContent = `${currentPage} / ${totalPages}`
            paginationContainer.appendChild(pageInfo)

            const nextBtn = document.createElement("button")
            nextBtn.className = `secondary-btn px-3 py-1 mx-1 rounded-lg text-sm ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'
            nextBtn.disabled = currentPage === totalPages
            nextBtn.addEventListener("click", () => { if (currentPage < totalPages) { currentPage++; renderProxyList(); } })
            paginationContainer.appendChild(nextBtn)
        }
        
        function checkProxyStatus(proxy) {
            const startTime = performance.now()
            
            const statusLoading = document.getElementById("proxy-status-loading")
            const statusActive = document.getElementById("proxy-status-active")
            const statusDead = document.getElementById("proxy-status-dead")
            const statusUnknown = document.getElementById("proxy-status-unknown")
            const latencyElement = document.getElementById("proxy-latency")

            statusLoading.classList.remove("hidden");
            [statusActive, statusDead, statusUnknown].forEach(el => el.classList.add("hidden"));
            latencyElement.textContent = '...'

            fetch(`${API_STATUS_URL}/${proxy.ip}:${proxy.port}`)
                .then((response) => response.json())
                .then((data) => {
                    const endTime = performance.now()
                    const latency = Math.floor(endTime - startTime)
                    statusLoading.classList.add("hidden")
                    const proxyData = Array.isArray(data) ? data[0] : data

                    if (proxyData && proxyData.proxyip === true) {
                        statusActive.classList.remove("hidden")
                        latencyElement.textContent = `${latency}ms`
                    } else {
                        statusDead.classList.remove("hidden")
                    }
                })
                .catch((error) => {
                    statusLoading.classList.add("hidden")
                    statusUnknown.classList.remove("hidden")
                    console.error("Error checking proxy status:", error)
                })
        }

        async function selectProxy(index) {
            selectedProxy = filteredProxyList[index]

            document.getElementById("selected-ip").textContent = selectedProxy.ip
            document.getElementById("selected-port").textContent = selectedProxy.port
            document.getElementById("selected-country").textContent = selectedProxy.country
            document.getElementById("selected-provider").textContent = selectedProxy.provider

            const baseAccountName = `${selectedProxy.country} - ${selectedProxy.provider}`
            const path = pathTemplate.replace("{ip}", selectedProxy.ip).replace("{port}", selectedProxy.port)

            document.getElementById("vless-path").value = path
            document.getElementById("trojan-path").value = path
            document.getElementById("ss-path").value = path
            
            // Set initial UUID/Password
            document.getElementById("vless-uuid").value = generateRandomUUID();
            document.getElementById("trojan-password").value = generateRandomUUID();
            document.getElementById("ss-password").value = generateRandomUUID();


            const updateAccountName = (protocol, security, nameId, baseName) => {
                const tlsType = security === "tls" ? "TLS" : "NTLS"
                document.getElementById(nameId).value = `${baseName} [${protocol}-${tlsType}]`
            }

            const securitySelects = [
                { id: "vless-security", nameId: "vless-name", protocol: "VLESS" },
                { id: "trojan-security", nameId: "trojan-name", protocol: "Trojan" },
                { id: "ss-security", nameId: "ss-name", protocol: "SS" },
            ]

            securitySelects.forEach((item) => {
                const select = document.getElementById(item.id)
                // Update the name immediately based on current selected value
                updateAccountName(item.protocol, select.value, item.nameId, baseAccountName);

                // Re-add change listeners
                const newSelect = select.cloneNode(true);
                select.parentNode.replaceChild(newSelect, select);
                newSelect.addEventListener("change", function () {
                    updateAccountName(item.protocol, this.value, item.nameId, baseAccountName);
                });
            })

            checkProxyStatus(selectedProxy)
        }

        // --- QR Code Functions ---
        function generateQRCode(text) {
            const qrcodeElement = document.getElementById("qrcode")
            qrcodeElement.innerHTML = ""

            try {
                if (typeof QRCode.toCanvas === 'function') {
                    const canvas = document.createElement('canvas');
                    qrcodeElement.appendChild(canvas);
                    QRCode.toCanvas(canvas, text, { width: 250, margin: 1 }, (error) => {
                        if (error) generateQRCodeFallback(text, qrcodeElement);
                    });
                } else {
                    generateQRCodeFallback(text, qrcodeElement);
                }
            } catch (error) {
                generateQRCodeFallback(text, qrcodeElement);
            }
        }

        function generateQRCodeFallback(text, container) {
            try {
                if (typeof QRCode.toString === 'function') {
                    QRCode.toString(text, { type: "svg", width: 250, margin: 1 }, (error, svg) => {
                        if (!error && svg) {
                            container.innerHTML = svg;
                        } else {
                            generateQRCodeLastResort(text, container);
                        }
                    });
                } else {
                    generateQRCodeLastResort(text, container);
                }
            } catch (error) {
                generateQRCodeLastResort(text, container);
            }
        }

        function generateQRCodeLastResort(text, container) {
            try {
                const encodedText = encodeURIComponent(text)
                const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`
                const img = document.createElement("img")
                img.src = qrApiUrl
                img.alt = "QR Code"
                img.width = 200
                img.height = 200
                img.onerror = () => {
                    container.innerHTML = '<div class="text-center text-rose-500">Failed to generate QR code</div>'
                }
                container.innerHTML = ""
                container.appendChild(img)
            } catch (error) {
                container.innerHTML = '<div class="text-center text-rose-500">Failed to generate QR code</div>'
            }
        }

        function downloadQRCode() {
            const qrcodeElement = document.getElementById("qrcode")
            const canvas = qrcodeElement.querySelector("canvas")
            const img = qrcodeElement.querySelector("img")
            const svg = qrcodeElement.querySelector("svg")
            let imageUrl = null
            let fileName = "qrcode.png";

            if (canvas) {
                try {
                    imageUrl = canvas.toDataURL("image/png")
                } catch (e) { /* silent fail */ }
            } else if (img) {
                imageUrl = img.src
            } else if (svg) {
                try {
                    const svgData = new XMLSerializer().serializeToString(svg)
                    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
                    imageUrl = URL.createObjectURL(svgBlob)
                    fileName = "qrcode.svg";
                } catch (e) { /* silent fail */ }
            }

            if (imageUrl) {
                const link = document.createElement("a")
                link.href = imageUrl
                link.download = fileName
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                if (imageUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(imageUrl)
                }
            } else {
                showModal('Failed to download QR code. Please try again.')
            }
        }

        function showModal(message) {
            const messageBox = document.createElement('div');
            messageBox.innerHTML = `<div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"><div class="bg-slate-800 p-6 rounded-lg shadow-xl text-white max-w-sm w-full"><p class="mb-4">${message}</p><button onclick="this.parentElement.parentElement.remove()" class="primary-btn w-full p-2 rounded-lg text-sm font-semibold">Tutup</button></div></div>`;
            document.body.appendChild(messageBox);
        }

        // --- Main Initialization Block ---
        document.addEventListener("DOMContentLoaded", () => {
            // Set current year in footer
            document.getElementById("current-year").textContent = new Date().getFullYear();

            // Initialize UUID/Passwords
            document.getElementById("vless-uuid").value = generateRandomUUID();
            document.getElementById("trojan-password").value = generateRandomUUID();
            document.getElementById("ss-password").value = generateRandomUUID();
            
            // Initial load of proxy list
            displayFallbackProxyList()
            loadProxyList(defaultProxyUrl)

            // Populate bug options dropdowns
            populateBugOptions()
            
            // Populate server domain dropdowns and set random default
            const serverDomainSelects = [
                document.getElementById("vless-server-domain"),
                document.getElementById("trojan-server-domain"),
                document.getElementById("ss-server-domain"),
            ]
            serverDomainSelects.forEach((select) => {
                if (select) {
                    select.innerHTML = ""
                    serverDomains.forEach((domain) => {
                        const option = document.createElement("option")
                        option.value = domain
                        option.textContent = domain
                        select.appendChild(option)
                    })
                    
                    // ** Menerapkan domain acak sebagai nilai default **
                    select.value = selectedServerDomain;
                    
                    select.addEventListener("change", function () {
                        selectedServerDomain = this.value
                    })
                }
            })

            // --- Event Listeners ---
            document.getElementById("refresh-btn").addEventListener("click", () => {
                loadProxyList(defaultProxyUrl)
            })
            document.getElementById("custom-url-btn").addEventListener("click", () => {
                customUrlInput.classList.toggle("hidden")
            })
            document.getElementById("load-custom-url").addEventListener("click", () => {
                const url = proxyUrlInput.value.trim()
                if (url) {
                    loadProxyList(url)
                }
            })
            document.getElementById("back-to-list").addEventListener("click", showProxyListSection)
            document.getElementById("back-to-form").addEventListener("click", () => {
                resultSection.classList.add("hidden")
                accountCreationSection.classList.remove("hidden")
            })
            document.getElementById("create-new").addEventListener("click", () => {
                // Also regenerate UUID/Password when creating new
                document.getElementById("vless-uuid").value = generateRandomUUID();
                document.getElementById("trojan-password").value = generateRandomUUID();
                document.getElementById("ss-password").value = generateRandomUUID();

                resultSection.classList.add("hidden")
                accountCreationSection.classList.remove("hidden")
            })
            document.getElementById("back-to-list-from-result").addEventListener("click", showProxyListSection)

            searchInput.addEventListener("input", function () {
                const searchTerm = this.value.toLowerCase().trim()
                if (searchTerm === "") {
                    filteredProxyList = [...proxyList]
                } else {
                    filteredProxyList = proxyList.filter(
                        (proxy) =>
                            proxy.provider.toLowerCase().includes(searchTerm) || proxy.country.toLowerCase().includes(searchTerm),
                    )
                }
                currentPage = 1
                renderProxyList()
            })

            // Protocol tabs logic
            document.querySelectorAll(".tab-btn").forEach((tab) => {
                tab.addEventListener("click", () => {
                    document.querySelectorAll(".tab-btn").forEach((t) => t.classList.remove("active"))
                    tab.classList.add("active")
                    document.querySelectorAll(".protocol-form").forEach((form) => form.classList.add("hidden"))
                    document.getElementById(tab.getAttribute("data-target")).classList.remove("hidden")
                })
            })

            // Custom Bug and Wildcard logic
            const bugInputs = [
                document.getElementById("vless-bug"),
                document.getElementById("trojan-bug"),
                document.getElementById("ss-bug"),
            ]
            bugInputs.forEach((select, index) => {
                const manualContainer = document.getElementById(select.id.replace("-bug", "-manual-bug-container"))
                const wildcardContainer = document.getElementById(select.id.replace("-bug", "-wildcard-container"))
                const wildcardCheckbox = document.getElementById(select.id.replace("-bug", "-wildcard"))

                select.addEventListener("change", function () {
                    const value = this.value;
                    const isManual = value === "manual";
                    const isCustomBug = value !== "" && value !== "manual";

                    manualContainer.style.display = isManual ? 'block' : 'none';
                    wildcardContainer.style.display = isCustomBug ? 'block' : 'none';
                    wildcardCheckbox.disabled = !isCustomBug;
                    if (!isCustomBug) wildcardCheckbox.checked = false; 
                })
            })

            // Form Submissions (VLESS, Trojan, SS)
            const forms = [
                document.getElementById("vless-account-form"),
                document.getElementById("trojan-account-form"),
                document.getElementById("ss-account-form"),
            ]

            forms.forEach((form) => {
                form.addEventListener("submit", (e) => {
                    e.preventDefault()
                    const formData = new FormData(form)
                    const formType = form.id.split("-")[0]

                    let customBug = formData.get("bug") ? formData.get("bug").toString().trim() : ""
                    if (customBug === "manual") {
                        customBug = document.getElementById(`${formType}-manual-bug`).value.trim()
                    }
                    const useWildcard = formData.get("wildcard") === "on"
                    
                    // Get domains/server details
                    const selectedDomain = formData.get("server-domain")
                    let server = selectedDomain
                    let host = selectedDomain
                    let sni = selectedDomain

                    if (customBug) {
                        server = customBug
                        if (useWildcard) {
                            host = `${customBug}.${selectedDomain}`
                            sni = `${customBug}.${selectedDomain}`
                        }
                    }

                    let connectionUrl = ""
                    const path = encodeURIComponent(formData.get("path"))
                    const security = formData.get("security")
                    const name = encodeURIComponent(formData.get("name"))
                    const port = security === "tls" ? 443 : 80
                    
                    if (formType === "vless") {
                        const uuid = formData.get("uuid")
                        connectionUrl = `vless://${uuid}@${server}:${port}?encryption=none&security=${security}&type=ws&host=${host}&path=${path}&sni=${sni}#${name}`
                    } else if (formType === "trojan") {
                        const password = formData.get("password")
                        connectionUrl = `trojan://${password}@${server}:${port}?security=${security}&type=ws&host=${host}&path=${path}&sni=${sni}#${name}`
                    } else if (formType === "ss") {
                        const password = formData.get("password")
                        const method = "none" // Fixed cipher for SS
                        const userInfo = btoa(`${method}:${password}`)
                        // SS URL format for V2Ray/Xray using WS
                        connectionUrl = `ss://${userInfo}@${server}:${port}?encryption=none&type=ws&host=${host}&path=${path}&security=${security}&sni=${sni}#${name}`
                    }

                    document.getElementById("connection-url").textContent = connectionUrl
                    generateQRCode(connectionUrl)
                    accountCreationSection.classList.add("hidden")
                    resultSection.classList.remove("hidden")
                })
            })
            
            // Copy URL button
            document.getElementById("copy-url").addEventListener("click", function () {
                const connectionUrl = document.getElementById("connection-url").textContent
                const textarea = document.createElement('textarea');
                textarea.value = connectionUrl;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    this.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!'
                    setTimeout(() => {
                        this.innerHTML = '<i class="far fa-copy mr-1"></i> Copy'
                    }, 2000)
                } catch (err) {
                    showModal('Gagal menyalin. Silakan salin manual.');
                }
                document.body.removeChild(textarea);
            })

            document.getElementById("download-qr").addEventListener("click", downloadQRCode)
            
            // Donation Modal Listeners
            donationButton.addEventListener('click', () => {
                donationModal.classList.remove('hidden');
            });

            closeDonation.addEventListener('click', () => {
                donationModal.classList.add('hidden');
            });

            // Prevent closing the modal when clicking inside the content (optional, but good practice)
            document.getElementById('donation-content').addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Close modal if user clicks outside content
            donationModal.addEventListener('click', () => {
                donationModal.classList.add('hidden');
            });
        })
