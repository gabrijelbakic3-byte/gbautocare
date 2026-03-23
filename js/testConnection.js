async function testSupabaseConnection() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.error('Supabase greška:', error.message);
      return;
    }

    console.log('Supabase je uspješno povezan.', data);
  } catch (err) {
    console.error('Neočekivana greška:', err);
  }
}

testSupabaseConnection();