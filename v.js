
    
        // Tab switching functionality
        document.getElementById('sendTab').addEventListener('click', function() {
            this.classList.add('tab-active');
            this.classList.remove('text-gray-500');
            document.getElementById('receiveTab').classList.remove('tab-active');
            document.getElementById('receiveTab').classList.add('text-gray-500');
            document.getElementById('sendForm').classList.remove('hidden');
            document.getElementById('receiveForm').classList.add('hidden');
        });

        document.getElementById('receiveTab').addEventListener('click', function() {
            this.classList.add('tab-active');
            this.classList.remove('text-gray-500');
            document.getElementById('sendTab').classList.remove('tab-active');
            document.getElementById('sendTab').classList.add('text-gray-500');
            document.getElementById('receiveForm').classList.remove('hidden');
            document.getElementById('sendForm').classList.add('hidden');
        });

        // Scanner functionality
        let scannerStream = null;
        
        function openScanner() {
            document.getElementById('scannerModal').classList.remove('hidden');
            startScanner();
        }

        function closeScanner() {
            document.getElementById('scannerModal').classList.add('hidden');
            stopScanner();
        }

        async function startScanner() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" } 
                });
                const video = document.getElementById('scannerVideo');
                video.srcObject = stream;
                video.play();
                scannerStream = stream;
                scanQRCode();
            } catch (err) {
                console.error('Error accessing camera:', err);
                alert('Could not access camera. Please check permissions.');
            }
        }

        function stopScanner() {
            if (scannerStream) {
                scannerStream.getTracks().forEach(track => track.stop());
                scannerStream = null;
            }
        }

        function scanQRCode() {
            const video = document.getElementById('scannerVideo');
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            function tick() {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        handleScannedCode(code.data);
                        return;
                    }
                }
                if (scannerStream) {
                    requestAnimationFrame(tick);
                }
            }
            tick();
        }

        function handleScannedCode(data) {
            try {
                const paymentData = JSON.parse(data);
                if (paymentData.recipient && paymentData.amount) {
                    // Fill payment form with scanned data
                    document.querySelector('#sendForm input[type="text"]').value = paymentData.recipient;
                    document.querySelector('#sendForm input[type="number"]').value = paymentData.amount;
                    document.getElementById('sendTab').click(); // Switch to send tab
                    closeScanner();
                    
                    // Show success message
                    alert(`Ready to send ${paymentData.amount} to ${paymentData.recipient}`);
                } else {
                    alert('Invalid QR code format');
                }
            } catch (e) {
                alert('Could not read QR code data');
            }
        }

        // Sample transaction data (in a real app, this would come from an API)
        const transactions = [
            {
                id: 1,
                name: "Amazon Purchase",
                date: "June 12, 2023",
                amount: -49.99,
                status: "Completed",
                icon: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/aa37f62e-982b-466f-93fe-591d530bfb38.png",
                type: "expense"
            },
            {
                id: 2,
                name: "John Smith",
                date: "June 10, 2023",
                amount: 120.00,
                status: "Completed",
                icon: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/94127f45-0908-42f8-8e4c-2bdb67b247b4.png",
                type: "income"
            },
            {
                id: 3,
                name: "Netflix Subscription",
                date: "June 5, 2023",
                amount: -14.99,
                status: "Completed",
                icon: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/57db27c0-e38b-4df0-8dc4-416e463c0011.png",
                type: "expense"
            }
        ];

        // In a real application, you would:
        // 1. Fetch transactions from an API
        // 2. Dynamically render them
        // 3. Implement actual payment processing
        // 4. Add form validation
        // 5. Implement proper authentication
    