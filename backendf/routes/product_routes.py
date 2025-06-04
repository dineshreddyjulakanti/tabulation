# routes/product_routes.py
from flask import Blueprint, request, jsonify
from models import Product
from auth import token_required

bp = Blueprint("products", __name__, url_prefix="/api/products")
bp.strict_slashes = False                       # /api/products  ==  /api/products/

# -------- helpers --------
def _json(doc: Product) -> dict:
    return {
        "_id": str(doc.id),
        "name": doc.name,
        "price": doc.price,
        "category": doc.category,
        "inStock": doc.inStock
    }

def get_product_by_id(pid):
    """Try multiple approaches to find a product by its ID"""
    # Direct lookup attempt
    product = Product.objects(id=pid).first()
    if product:
        print(f"Found product by direct ID lookup: {product.name}")
        return product
        
    # Try searching all products and comparing IDs as strings
    print(f"Direct lookup failed for ID {pid}, trying string comparison...")
    all_products = list(Product.objects)
    for p in all_products:
        if str(p.id) == pid:
            print(f"Found product by string comparison: {p.name}")
            return p
    
    # If we got here, we couldn't find the product
    print(f"No product found with ID {pid}")
    print(f"Available IDs: {[str(p.id) for p in all_products[:5]]}")
    return None

# -------- routes ---------
@bp.get("/")                                    # GET /api/products
def list_all():
    try:
        prods = list(Product.objects)
        print(f"Fetched products count: {len(prods)}")
        
        # Print first product for debugging if any exist
        if prods:
            print(f"Sample product: {prods[0].to_json()}")
        else:
            print("No products found! Check your MongoDB collection name and data.")
        
        return jsonify([_json(p) for p in prods]), 200
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        return jsonify({"error": str(e)}), 500

@bp.get("/search")                              # GET /api/products/search?name=...
def search():
    name = request.args.get("name", "")
    docs = Product.objects(name__icontains=name)
    return jsonify([_json(p) for p in docs]), 200

@bp.put("/<pid>")                               # PUT /api/products/:id
@token_required
def update(pid):
    try:
        payload = request.get_json(force=True)
        print(f"Update request for product ID: {pid}")
        
        # Remove ID fields from payload
        for id_field in ['_id', 'id']:
            if id_field in payload:
                del payload[id_field]
            
        # Only allow updates to specific fields with proper type conversion
        allowed_updates = {}
        
        # Handle string fields
        for field in ['name', 'category']:
            if field in payload and payload[field] is not None:
                allowed_updates[field] = str(payload[field])
        
        # Handle numeric fields
        if 'price' in payload and payload['price'] is not None:
            allowed_updates['price'] = float(payload['price'])
        
        # Handle boolean fields
        if 'inStock' in payload:
            allowed_updates['inStock'] = bool(payload['inStock'])
        
        print(f"Sanitized update data: {allowed_updates}")
        
        # First - verify the product exists
        product = Product.objects(id=pid).first()
        if not product:
            # Try another lookup approach if direct ID lookup failed
            all_products = list(Product.objects)
            matching_products = [p for p in all_products if str(p.id) == pid]
            
            if not matching_products:
                print(f"No product found with ID {pid}")
                return jsonify({"error": f"Product with ID {pid} not found"}), 404
            else:
                product = matching_products[0]
                
        print(f"Found product: {product.name} with ID {product.id}")
        
        # APPROACH 1: Direct field update
        print("Trying direct field update...")
        for field, value in allowed_updates.items():
            setattr(product, field, value)
        
        try:
            product.save()
            print("Update successful using direct field update")
            return jsonify(_json(product)), 200
        except Exception as e:
            print(f"Direct field update failed: {str(e)}")
            
        # APPROACH 2: Direct document replacement
        try:
            print("Trying direct document replacement...")
            # Create updated document
            updated_doc = {
                "id": pid,
                "name": allowed_updates.get('name', product.name),
                "price": allowed_updates.get('price', product.price),
                "category": allowed_updates.get('category', product.category),
                "inStock": allowed_updates.get('inStock', product.inStock)
            }
            # Delete and recreate
            product.delete()
            new_product = Product(**updated_doc).save()
            print("Update successful using document replacement")
            return jsonify(_json(new_product)), 200
        except Exception as e:
            print(f"Document replacement failed: {str(e)}")
            
        # If we got here, both update methods failed
        return jsonify({"error": "Failed to update product after multiple attempts"}), 500
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error updating product: {str(e)}")
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

@bp.delete("/<pid>")                            # DELETE /api/products/:id
@token_required
def delete(pid):
    ok = bool(Product.objects(id=pid).delete())
    return jsonify({"success": ok}), 200
