import Head from "next/head";
import React from 'react';
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [asignatura, setAsignatura] = useState('');
  const [minutos, setMinutos] = useState(90);
  const [contenido, setContenido] = useState('');
  const [nivel, setNivel] = useState('Primaria');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-classgen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ asignatura, minutos, contenido, nivel }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result.replaceAll('\n', '<br />'));
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Generador de clases 👩‍🏫🧑‍🏫</h3>
        <form onSubmit={onSubmit}>

        <label>Asignatura</label>
          <input
            type="text"
            name="asignatura"
            placeholder="Escriba su asignatura"
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
          />

          <label>Cual es el nivel educacional?</label>
          <select
            name="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
          </select>

          <label>Minutos de clases</label>
          <input
            type="number"
            min={1}
            max={180}
            name="minutos"
            placeholder="Tiempo de clases"
            value={minutos}
            onChange={(e) => setMinutos(Number.parseInt(e.target.value))}
          />

          <label>Contenido de la clase</label>
          <input
            type="text"
            name="contenido"
            placeholder="Ingrese el contenido a ver"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <input type="submit" value="Generar estructura de clase" />
        </form>

        {loading && (
          <div>
            <h3>Generando la estructura de la clase 🍎💡</h3>
            <img src="/loading.gif" className={styles.loading} />
          </div>
        )}

        <div
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </main>
    </div>
  );
}
