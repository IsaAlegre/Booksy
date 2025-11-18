import { motion } from "framer-motion";

export default function UserProfileViewer({ profile, booksRead=0 }) {
  const imgSrc = profile.profilePicture || "";
  const hasProfilePicture = !!imgSrc;
  const maxBooks = 10; // Mostrar máximo 10 libros en la estantería
  const booksToShow = Math.min(booksRead, maxBooks);


  function pastelColor(index) {
  const hues = [220, 240, 260, 280, 300]; 
  return `hsl(${hues[index % hues.length]}, 55%, 75%)`;
}

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl p-10 rounded-3xl mb-10"
    >

      <div className="flex flex-col md:flex-row gap-10 items-center">

        {/* Foto */}
        <div className="relative drop-shadow-xl">
          {hasProfilePicture ? (
            <>
              <img
                src={imgSrc}
                className="w-40 h-40 rounded-3xl object-cover border border-white/20 shadow-xl"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-300/10 pointer-events-none"></div>
            </>
          ) : (
            <div className="w-40 h-40 rounded-3xl bg-gray-400 border border-white/20 shadow-xl flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Texto con reveal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="flex-1 text-center md:text-left space-y-3"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            className="mt-6"
          >
            <p className="text-sm text-gray-600 mb-2">
              {booksRead} {booksRead === 1 ? 'libro leído' : 'libros leídos'}
            </p>
            <div className="flex gap-2 items-end h-20">
              {Array.from({ length: booksToShow }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    rotate: i % 2 === 0 ? -2 : 2,
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="w-6 rounded-md origin-bottom shadow-lg"
                  style={{
                    height: `${55 + (i % 3) * 10}px`, // alturas más armónicas
                    backgroundColor: pastelColor(i),
                  }}
                />
              ))}

              {booksRead > maxBooks && (
                <span className="ml-2 text-xl text-purple-600 font-bold">
                  +{booksRead - maxBooks}
                </span>
              )}
            </div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-4xl font-bold text-gray-900/90"
          >
            {profile.username}
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-gray-700 text-lg"
          >
            {profile.description || "Sin descripción"}
          </motion.p>
          </motion.div>
        </motion.div>

      </div>
    </motion.section>
  );
}