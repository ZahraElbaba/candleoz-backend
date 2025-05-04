// controllers/productController.js
const {supabase} = require('../supabaseClient');
const { v4: uuidv4 } = require('uuid');

// @desc    Add a new product with images
// @route   POST /api/products/add
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const files = req.files;

    // Upload all images to Supabase Storage and get public URLs
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const fileName = `${uuidv4()}-${file.originalname}`;
        const { data, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) throw uploadError;

        console.log('test: ', data)
        
        await supabase.storage
          .from('images').createSignedUrl(data.path, 10000000000000)


        const { data: publicUrlData } = supabase.storage
        .from('images').getPublicUrl();
          
        console.log({publicUrlData})

        return publicUrlData.publicUrl;
      })
    );
// https://iuuarglggriqouecetgw.supabase.co/storage/v1/object/sign/images/60d0709d-5483-41d5-af9a-d960b32f764d-image%2016.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2NjOGJiZGUxLWY1ZmEtNDFjZC1hOTFmLTdjNzQzOTAwNDdjMiJ9.eyJ1cmwiOiJpbWFnZXMvNjBkMDcwOWQtNTQ4My00MWQ1LWFmOWEtZDk2MGIzMmY3NjRkLWltYWdlIDE2LnBuZyIsImlhdCI6MTc0NjM1MjI1OCwiZXhwIjoxNzQ2OTU3MDU4fQ.YYp7QYks7AdckUwDyJgqVV630MT8wfLAd11SR1ecoSs
    console.log({
      imageUrls
    })
    
    // Insert product with image URLs as array
    const {status, error } = await supabase
      .from('products')
      .insert([{ name, description, price, imageUrls }]);

    if (error) throw error;

    if (status === 201)
      res.status(201).json({ message: 'Product added'});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};

// @desc    Get a product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.status(200).json(data);
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
exports.deleteProductById = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: 'Product deleted' });
};
