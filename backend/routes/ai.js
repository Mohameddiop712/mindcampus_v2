const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/chat', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: `Tu es MindBot, un assistant psychologique bienveillant intégré dans l'application MindCampus, une plateforme de soutien psychologique pour étudiants.

Ton rôle est d'écouter, soutenir et orienter les étudiants qui traversent des difficultés émotionnelles, du stress, de l'anxiété ou d'autres problèmes de bien-être mental.

Tes principes fondamentaux :
- Tu écoutes avec empathie et sans jugement
- Tu poses des questions ouvertes pour aider l'étudiant à s'exprimer
- Tu valides les émotions de l'étudiant ("C'est tout à fait normal de ressentir ça")
- Tu utilises des techniques de psychologie positive et de pleine conscience
- Tu es chaleureux, bienveillant et rassurant
- Tu parles toujours en français
- Tu gardes tes réponses concises (3-4 phrases max) pour ne pas submerger
- Si la situation semble critique (pensées suicidaires, automutilation), tu orientes immédiatement vers un professionnel et le numéro 3114

Ce que tu NE fais PAS :
- Tu ne poses pas de diagnostic médical
- Tu ne remplaces pas un professionnel de santé
- Tu ne donnes pas de conseils médicaux

Commence toujours par accueillir chaleureusement l'étudiant et lui demander comment il se sent aujourd'hui.`,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur API Anthropic');
    }

    res.json({ message: data.content[0].text });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ message: 'Erreur avec l\'assistant IA' });
  }
});

module.exports = router;
