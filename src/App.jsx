import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const supabaseUrl = "https://xehglwqyjrdciumpiteh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaGdsd3F5anJkY2l1bXBpdGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMDI2NDUsImV4cCI6MjA1NDU3ODY0NX0.bQHP2uReu6f9Gw98Un9I_Ogw7FYR1OCaHW-grAQLwqw";
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const [currentCall, setCurrentCall] = useState(null);
    const lastCalledRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    const filteredQueue = queue.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = format(now, "dd MMMM yyyy", { locale: localeId });
            const formattedTime = format(now, "HH:mm");
            setCurrentDate(formattedDate);
            setCurrentTime(formattedTime);
        };

        updateDateTime();
        const timer = setInterval(updateDateTime, 1000); // Perbarui waktu setiap detik
        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        fetchQueue();
    }, []);

    // Ambil data antrian dari Supabase
    const fetchQueue = async () => {
        const { data, error } = await supabase
            .from("queue")
            .select("number, name")
            .order("number", { ascending: true });

        if (!error) {
            setQueue(data || []);
            setCounter(data.length > 0 ? data[data.length - 1].number + 1 : 1);
        }
    };

    // Tambah Antrian dengan Nama
    const addQueue = async () => {
        if (nameInput.trim() !== "") {
            const newEntry = { number: counter, name: nameInput.trim() };
            const { error } = await supabase.from("queue").insert(newEntry);

            if (!error) {
                setQueue((prev) => [...prev, newEntry]);
                setCounter((prev) => prev + 1);
                setNameInput("");
            }
        }
    };

    // Fungsi untuk memutar suara panggilan
    // const playSound = (number, name) => {
    //     const message = `Antrian nomor ${number} atas nama ${name}`;
    //     const utterance = new SpeechSynthesisUtterance(message);
    //     utterance.lang = "id-ID";
    //     window.speechSynthesis.speak(utterance);
    // };
    const playSound = (number, name) => {
        window.speechSynthesis.cancel(); // Hentikan semua suara yang sedang berjalan
        const message = `Antrian nomor ${number} atas nama ${name}`;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "id-ID";
        utterance.onstart = () => console.log("Memulai pemutaran suara");
        utterance.onerror = (e) => console.error("Terjadi kesalahan:", e);
        utterance.onend = () => console.log("Pemutaran selesai");
        window.speechSynthesis.speak(utterance);
    };

    // Panggil Antrian Pertama
    const callNext = () => {
        if (queue.length > 0) {
            const next = queue[0];
            lastCalledRef.current = next;
            playSound(next.number, next.name);
            setCurrentCall(next);
            setQueue((prev) => prev.slice(1));
            deleteQueue(next.number);
        }
    };

    // Hapus antrian yang telah dipanggil
    const deleteQueue = async (number) => {
        await supabase.from("queue").delete().eq("number", number);
    };

    // Panggil Ulang Antrian Terakhir
    const recallLast = () => {
        if (lastCalledRef.current) {
            const { number, name } = lastCalledRef.current;
            playSound(number, name);
            setCurrentCall(lastCalledRef.current);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">

            {/* Tanggal Sekarang */}
            <div className="mb-6 flex flex-col md:flex-row gap-8 items-center mt-4">

                {/* Tanggal Sekarang */}
                <div className="flex flex-col items-center bg-blue-100 px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-lg font-semibold text-gray-700">Tanggal Hari Ini</p>
                    <p className="text-2xl font-bold text-blue-800">{currentDate}</p>
                </div>

                {/* Waktu Sekarang */}
                <div className="flex flex-col items-center bg-green-100 px-6 py-4 rounded-2xl shadow-lg">
                    <p className="text-lg font-semibold text-gray-700">Waktu Sekarang</p>
                    <p className="text-2xl font-bold text-green-800">{currentTime}</p>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-10">Antrian Pemberkasan PPPK Tahap 1 Kab. Tojo Una-Una</h1>

            {currentCall && (
                <div className="mb-8 p-4 bg-blue-100 rounded-xl text-center shadow-md">
                    <p className="text-xl font-semibold">Sedang Dipanggil:</p>
                    <p className="text-2xl font-bold">Antrian {currentCall.number}: {currentCall.name}</p>
                </div>
            )}

            <motion.div
                className="grid grid-cols-2 gap-16"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8}}
            >
                <div className="space-y-8">
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
                </div>

                <div className="max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Daftar Antrian:</h2>
                        <input
                            type="text"
                            placeholder="Cari nama..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="h-96 w-[450px] overflow-y-scroll border rounded-lg p-4 bg-white">
                        {filteredQueue.length === 0 ? (
                            <p className="text-gray-600">Tidak ada antrian.</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-2">
                                {filteredQueue.map((item, index) => (
                                    <li key={index} className="text-lg">
                                        Antrian {item.number}: {item.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}