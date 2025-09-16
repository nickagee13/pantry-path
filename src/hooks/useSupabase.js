import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

// =============================================
// GROCERY LIST HOOKS
// =============================================

export const useGroceryList = () => {
  const { user } = useAuth()
  const [groceryList, setGroceryList] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGroceryList = async () => {
    if (!user) {
      setGroceryList({})
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // First get all stores for this user
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order')

      if (storesError) throw storesError

      // Then get all grocery items for this user
      const { data: groceryItems, error: itemsError } = await supabase
        .from('grocery_items')
        .select(`
          *,
          stores!inner(name)
        `)
        .eq('user_id', user.id)
        .order('created_at')

      if (itemsError) throw itemsError

      // Group items by store
      const groupedList = {}
      stores.forEach(store => {
        groupedList[store.name] = groceryItems.filter(
          item => item.stores.name === store.name
        )
      })

      setGroceryList(groupedList)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching grocery list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroceryList()

    // Set up real-time subscription
    if (user) {
      const subscription = supabase
        .channel('grocery_changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'grocery_items',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchGroceryList()
          }
        )
        .subscribe()

      return () => subscription.unsubscribe()
    }
  }, [user])

  const addGroceryItem = async (storeName, item) => {
    if (!user) return

    try {
      // Get store ID
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', storeName)
        .single()

      if (!store) throw new Error('Store not found')

      const { error } = await supabase
        .from('grocery_items')
        .insert({
          user_id: user.id,
          store_id: store.id,
          name: item.name,
          quantity: item.quantity || '1',
          added_by: item.addedBy
        })

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error adding grocery item:', err)
    }
  }

  const updateGroceryItem = async (itemId, updates) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('grocery_items')
        .update(updates)
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error updating grocery item:', err)
    }
  }

  const deleteGroceryItem = async (itemId) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error deleting grocery item:', err)
    }
  }

  return {
    groceryList,
    loading,
    error,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem,
    refetch: fetchGroceryList
  }
}

// =============================================
// INVENTORY HOOKS
// =============================================

export const useInventory = () => {
  const { user } = useAuth()
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInventory = async () => {
    if (!user) {
      setInventory([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setInventory(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()

    // Set up real-time subscription
    if (user) {
      const subscription = supabase
        .channel('inventory_changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'inventory_items',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchInventory()
          }
        )
        .subscribe()

      return () => subscription.unsubscribe()
    }
  }, [user])

  const addInventoryItem = async (item) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          user_id: user.id,
          ...item
        })

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error adding inventory item:', err)
    }
  }

  const updateInventoryItem = async (itemId, updates) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error updating inventory item:', err)
    }
  }

  const deleteInventoryItem = async (itemId) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error deleting inventory item:', err)
    }
  }

  return {
    inventory,
    loading,
    error,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refetch: fetchInventory
  }
}

// =============================================
// STORES HOOKS
// =============================================

export const useStores = () => {
  const { user } = useAuth()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStores = async () => {
    if (!user) {
      setStores([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order')

      if (error) throw error

      setStores(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching stores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [user])

  const updateStoreOrder = async (newOrder) => {
    if (!user) return

    try {
      const updates = newOrder.map((storeName, index) => ({
        name: storeName,
        sort_order: index + 1
      }))

      for (const update of updates) {
        await supabase
          .from('stores')
          .update({ sort_order: update.sort_order })
          .eq('user_id', user.id)
          .eq('name', update.name)
      }

      fetchStores() // Refresh the list
    } catch (err) {
      setError(err.message)
      console.error('Error updating store order:', err)
    }
  }

  return {
    stores,
    loading,
    error,
    updateStoreOrder,
    refetch: fetchStores
  }
}

// =============================================
// RECIPES HOOKS
// =============================================

export const useRecipes = () => {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRecipes = async () => {
    if (!user) {
      setRecipes([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recipes_with_availability')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRecipes(data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()

    // Set up real-time subscription
    if (user) {
      const subscription = supabase
        .channel('recipe_changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'recipes',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchRecipes()
          }
        )
        .subscribe()

      return () => subscription.unsubscribe()
    }
  }, [user])

  const addRecipe = async (recipe) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          ...recipe
        })

      if (error) throw error
    } catch (err) {
      setError(err.message)
      console.error('Error adding recipe:', err)
    }
  }

  return {
    recipes,
    loading,
    error,
    addRecipe,
    refetch: fetchRecipes
  }
}