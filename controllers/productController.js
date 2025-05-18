// controllers/productController.js
const { response } = require('express');
const { supabase } = require('../supabaseClient');
const { v4: uuidv4 } = require('uuid');

// @desc    Add a new product with images
// @route   POST /api/products/add
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const files = req.files;

    console.log({files})

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

        // console.log('test: ', data);

        // const respose = await supabase.storage
        //   .from('images')
        //   .createSignedUrl(data.path, 10000000000000);

          // console.log({respose})

        // const { data: publicUrlData } = supabase.storage
        //   .from('images')
        //   .getPublicUrl(fileName);

        return data.path
      })
    );
    
    // Insert product with image URLs as array
    const { status, error } = await supabase
      .from('products')
      .insert([{ name, description, price, imageUrls }]);

    if (error) throw error;

    if (status === 201) res.status(201).json({ message: 'Product added' });

  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');


    const newData = await Promise.all(
      data.map(async (product) => {
        const { imageUrls: imagePaths, ...rest } = product;
    
        const signedUrls = await Promise.all(
          imagePaths?.map(async (path) => {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('images')
              .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
    
            if (signedError) {
              console.error('Error creating signed URL:', signedError);
              return null;
            }
    
            return signedData.signedUrl;
          })
        );
    
        return { ...rest, imageUrls: signedUrls };
      })
    );
    

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    console.log('Fetched products:', newData);  // Log fetched data to verify the response
    res.status(200).json(newData);
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get a product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  console.log({id})

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

    const { imageUrls: imagePaths, ...rest } = product;
    
    const signedUrls = await Promise.all(
      imagePaths?.map(async (path) => {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('images')
          .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days

        if (signedError) {
          console.error('Error creating signed URL:', signedError);
          return null;
        }

        return signedData.signedUrl;
      })
    );

    const newData= { ...rest, imageUrls: signedUrls };

  if (error) return res.status(404).json({ error: error.message });
  res.status(200).json(newData);
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
