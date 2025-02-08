import { useState, useRef } from "react";
import { motion } from "framer-motion";

function Card({ children, className = "" }) {
    return (
        <div className={`max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
}

function Button({ onClick, children, className = "", disabled = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg text-white font-medium focus:outline-none disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}

export default function QueueApp() {
    const [queue, setQueue] = useState([]);
    const [counter, setCounter] = useState(1);
    const [nameInput, setNameInput] = useState("");
    const lastCalledRef = useRef(null);

    // Tambah Antrian dengan Nama
    const addQueue = () => {
        if (nameInput.trim() !== "") {
            setQueue((prev) => [...prev, { number: counter, name: nameInput.trim() }]);
            setCounter((prev) => prev + 1);
            setNameInput("");
        }
    };

    // Fungsi untuk memutar suara panggilan
    const playSound = (number, name) => {
        const message = `Antrian nomor ${number} atas nama ${name}`;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "id-ID";
        window.speechSynthesis.speak(utterance);
    };

    // Panggil Antrian Pertama
    const callNext = () => {
        if (queue.length > 0) {
            const next = queue[0];
            lastCalledRef.current = next;
            playSound(next.number, next.name);
            alert(`Memanggil Antrian ${next.number}: ${next.name}`);
            setQueue((prev) => prev.slice(1));
        }
    };

    // Panggil Ulang Antrian Terakhir
    const recallLast = () => {
        if (lastCalledRef.current) {
            const { number, name } = lastCalledRef.current;
            playSound(number, name);
            alert(`Memanggil Ulang Antrian ${number}: ${name}`);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Antrian Pemberkasan PPPK Tahap 1</h1>
            <motion.div
                className="grid gap-4 mb-8 grid-cols-1 md:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Card className="p-4">
                    <CardContent>
                        <h2 className="text-xl font-semibold mb-4">Tambahkan Antrian</h2>
                        <input
                            type="text"
                            placeholder="Masukkan Nama"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <Button onClick={addQueue} className="bg-blue-500 hover:bg-blue-600">
                            Tambah Antrian
                        </Button>
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardContent>
                        <h2 className="text-xl font-semibold mb-4">Panggil Antrian</h2>
                        <div className="flex gap-4">
                            <Button
                                onClick={callNext}
                                disabled={queue.length === 0}
                                className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                            >
                                Panggil Antrian Berikutnya
                            </Button>
                            <Button
                                onClick={recallLast}
                                disabled={!lastCalledRef.current}
                                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
                            >
                                Panggil Ulang Antrian
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Daftar Antrian:</h2>
                {queue.length === 0 ? (
                    <p className="text-gray-600">Tidak ada antrian.</p>
                ) : (
                    <ul className="list-disc list-inside space-y-2">
                        {queue.map((item, index) => (
                            <li key={index} className="text-lg">
                                Antrian {item.number}: {item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
