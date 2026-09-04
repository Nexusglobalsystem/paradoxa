// Généré via `mcp__claude_ai_Supabase__generate_typescript_types` (projet
// wekiteeffcixizdxmlvs). Régénérer après chaque migration plutôt qu'éditer
// à la main — voir la commande `pnpm db:types` dans CLAUDE.md.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      commande_lignes: {
        Row: {
          commande_id: string
          created_at: string
          id: string
          nom_produit: string
          prix_unitaire: number
          produit_id: string | null
          quantite: number
          sous_total: number
        }
        Insert: {
          commande_id: string
          created_at?: string
          id?: string
          nom_produit: string
          prix_unitaire: number
          produit_id?: string | null
          quantite: number
          sous_total: number
        }
        Update: {
          commande_id?: string
          created_at?: string
          id?: string
          nom_produit?: string
          prix_unitaire?: number
          produit_id?: string | null
          quantite?: number
          sous_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "commande_lignes_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commande_lignes_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      commandes: {
        Row: {
          adresse_ligne1: string
          adresse_ligne2: string | null
          client_id: string | null
          code_postal: string
          created_at: string
          devise: string
          email: string
          frais_livraison: number
          id: string
          nom_complet: string
          notes: string | null
          numero_commande: string
          numero_suivi: string | null
          pays: string
          sous_total: number
          statut: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          telephone: string | null
          total: number
          transporteur: string | null
          updated_at: string
          ville: string
        }
        Insert: {
          adresse_ligne1: string
          adresse_ligne2?: string | null
          client_id?: string | null
          code_postal: string
          created_at?: string
          devise?: string
          email: string
          frais_livraison?: number
          id?: string
          nom_complet: string
          notes?: string | null
          numero_commande: string
          numero_suivi?: string | null
          pays?: string
          sous_total: number
          statut?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          telephone?: string | null
          total: number
          transporteur?: string | null
          updated_at?: string
          ville: string
        }
        Update: {
          adresse_ligne1?: string
          adresse_ligne2?: string | null
          client_id?: string | null
          code_postal?: string
          created_at?: string
          devise?: string
          email?: string
          frais_livraison?: number
          id?: string
          nom_complet?: string
          notes?: string | null
          numero_commande?: string
          numero_suivi?: string | null
          pays?: string
          sous_total?: number
          statut?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          telephone?: string | null
          total?: number
          transporteur?: string | null
          updated_at?: string
          ville?: string
        }
        Relationships: []
      }
      formule_lignes: {
        Row: {
          created_at: string
          etage: string | null
          formule_id: string
          grammes: number | null
          id: string
          matiere_id: string
          notes: string | null
          ordre: number
          phase: string | null
          pourcentage: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          etage?: string | null
          formule_id: string
          grammes?: number | null
          id?: string
          matiere_id: string
          notes?: string | null
          ordre?: number
          phase?: string | null
          pourcentage: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          etage?: string | null
          formule_id?: string
          grammes?: number | null
          id?: string
          matiere_id?: string
          notes?: string | null
          ordre?: number
          phase?: string | null
          pourcentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formule_lignes_formule_id_fkey"
            columns: ["formule_id"]
            isOneToOne: false
            referencedRelation: "formules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formule_lignes_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      formules: {
        Row: {
          code_reference: string | null
          created_at: string
          created_by: string | null
          description: string | null
          est_version_courante: boolean
          formule_parent_id: string | null
          id: string
          maison: string
          nom: string
          notes: string | null
          ph_cible: number | null
          poids_reference_g: number
          statut: string
          type_concentration: string | null
          type_formule: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          code_reference?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          est_version_courante?: boolean
          formule_parent_id?: string | null
          id?: string
          maison: string
          nom: string
          notes?: string | null
          ph_cible?: number | null
          poids_reference_g?: number
          statut?: string
          type_concentration?: string | null
          type_formule: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          code_reference?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          est_version_courante?: boolean
          formule_parent_id?: string | null
          id?: string
          maison?: string
          nom?: string
          notes?: string | null
          ph_cible?: number | null
          poids_reference_g?: number
          statut?: string
          type_concentration?: string | null
          type_formule?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "formules_formule_parent_id_fkey"
            columns: ["formule_parent_id"]
            isOneToOne: false
            referencedRelation: "formules"
            referencedColumns: ["id"]
          },
        ]
      }
      lot_matieres: {
        Row: {
          analyses: Json
          created_at: string
          fournisseur: string | null
          id: string
          lot_id: string
          matiere_id: string
          numero_lot_fournisseur: string | null
          quantite_incorporee: number
          unite: string
        }
        Insert: {
          analyses?: Json
          created_at?: string
          fournisseur?: string | null
          id?: string
          lot_id: string
          matiere_id: string
          numero_lot_fournisseur?: string | null
          quantite_incorporee: number
          unite?: string
        }
        Update: {
          analyses?: Json
          created_at?: string
          fournisseur?: string | null
          id?: string
          lot_id?: string
          matiere_id?: string
          numero_lot_fournisseur?: string | null
          quantite_incorporee?: number
          unite?: string
        }
        Relationships: [
          {
            foreignKeyName: "lot_matieres_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lot_matieres_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      lots: {
        Row: {
          atelier_cuve: string | null
          contenance_unitaire_ml: number | null
          cout_matiere_total: number | null
          cout_unitaire: number | null
          created_at: string
          created_by: string | null
          date_fabrication: string
          date_peremption: string | null
          duree_conservation_mois: number | null
          empreinte_integrite: string | null
          formule_id: string
          id: string
          notes: string | null
          numero_lot: string
          pao_mois: number | null
          quantite_tiree: number
          responsable_id: string | null
          responsable_nom: string | null
          statut: string
          unite_quantite: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          atelier_cuve?: string | null
          contenance_unitaire_ml?: number | null
          cout_matiere_total?: number | null
          cout_unitaire?: number | null
          created_at?: string
          created_by?: string | null
          date_fabrication?: string
          date_peremption?: string | null
          duree_conservation_mois?: number | null
          empreinte_integrite?: string | null
          formule_id: string
          id?: string
          notes?: string | null
          numero_lot: string
          pao_mois?: number | null
          quantite_tiree: number
          responsable_id?: string | null
          responsable_nom?: string | null
          statut?: string
          unite_quantite?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          atelier_cuve?: string | null
          contenance_unitaire_ml?: number | null
          cout_matiere_total?: number | null
          cout_unitaire?: number | null
          created_at?: string
          created_by?: string | null
          date_fabrication?: string
          date_peremption?: string | null
          duree_conservation_mois?: number | null
          empreinte_integrite?: string | null
          formule_id?: string
          id?: string
          notes?: string | null
          numero_lot?: string
          pao_mois?: number | null
          quantite_tiree?: number
          responsable_id?: string | null
          responsable_nom?: string | null
          statut?: string
          unite_quantite?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lots_formule_id_fkey"
            columns: ["formule_id"]
            isOneToOne: false
            referencedRelation: "formules"
            referencedColumns: ["id"]
          },
        ]
      }
      matiere_limites_ifra: {
        Row: {
          application_typique: string | null
          categorie_ifra: string
          created_at: string
          id: string
          matiere_id: string
          seuil_libelle: string | null
          seuil_pourcentage: number | null
          statut: string
          updated_at: string
        }
        Insert: {
          application_typique?: string | null
          categorie_ifra: string
          created_at?: string
          id?: string
          matiere_id: string
          seuil_libelle?: string | null
          seuil_pourcentage?: number | null
          statut?: string
          updated_at?: string
        }
        Update: {
          application_typique?: string | null
          categorie_ifra?: string
          created_at?: string
          id?: string
          matiere_id?: string
          seuil_libelle?: string | null
          seuil_pourcentage?: number | null
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matiere_limites_ifra_matiere_id_fkey"
            columns: ["matiere_id"]
            isOneToOne: false
            referencedRelation: "matieres"
            referencedColumns: ["id"]
          },
        ]
      }
      matieres: {
        Row: {
          cas_number: string | null
          created_at: string
          created_by: string | null
          donnees_complementaires: Json
          est_captif: boolean
          facette_libre: string | null
          famille_olfactive: string
          fournisseur: string | null
          id: string
          inci: string | null
          nature: string
          nom: string
          notes: string | null
          origine: string | null
          prix_kg: number
          puissance: number
          reference_interne: string | null
          seuil_alerte_stock_kg: number | null
          statut: string
          stock_kg: number
          updated_at: string
          updated_by: string | null
          volatilite: string | null
        }
        Insert: {
          cas_number?: string | null
          created_at?: string
          created_by?: string | null
          donnees_complementaires?: Json
          est_captif?: boolean
          facette_libre?: string | null
          famille_olfactive: string
          fournisseur?: string | null
          id?: string
          inci?: string | null
          nature?: string
          nom: string
          notes?: string | null
          origine?: string | null
          prix_kg?: number
          puissance?: number
          reference_interne?: string | null
          seuil_alerte_stock_kg?: number | null
          statut?: string
          stock_kg?: number
          updated_at?: string
          updated_by?: string | null
          volatilite?: string | null
        }
        Update: {
          cas_number?: string | null
          created_at?: string
          created_by?: string | null
          donnees_complementaires?: Json
          est_captif?: boolean
          facette_libre?: string | null
          famille_olfactive?: string
          fournisseur?: string | null
          id?: string
          inci?: string | null
          nature?: string
          nom?: string
          notes?: string | null
          origine?: string | null
          prix_kg?: number
          puissance?: number
          reference_interne?: string | null
          seuil_alerte_stock_kg?: number | null
          statut?: string
          stock_kg?: number
          updated_at?: string
          updated_by?: string | null
          volatilite?: string | null
        }
        Relationships: []
      }
      produits: {
        Row: {
          code_reference: string | null
          contenance_unite: string | null
          contenance_valeur: number | null
          created_at: string
          created_by: string | null
          description: string | null
          devise: string
          epigraphe: string | null
          escale_geographique: string | null
          formule_id: string | null
          id: string
          image_url: string | null
          maison: string
          nom: string
          prix: number
          protocole_application: string | null
          seuil_alerte_stock: number
          slug: string
          statut: string
          stock: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code_reference?: string | null
          contenance_unite?: string | null
          contenance_valeur?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          devise?: string
          epigraphe?: string | null
          escale_geographique?: string | null
          formule_id?: string | null
          id?: string
          image_url?: string | null
          maison: string
          nom: string
          prix?: number
          protocole_application?: string | null
          seuil_alerte_stock?: number
          slug: string
          statut?: string
          stock?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code_reference?: string | null
          contenance_unite?: string | null
          contenance_valeur?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          devise?: string
          epigraphe?: string | null
          escale_geographique?: string | null
          formule_id?: string | null
          id?: string
          image_url?: string | null
          maison?: string
          nom?: string
          prix?: number
          protocole_application?: string | null
          seuil_alerte_stock?: number
          slug?: string
          statut?: string
          stock?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produits_formule_id_fkey"
            columns: ["formule_id"]
            isOneToOne: false
            referencedRelation: "formules"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nom_complet: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nom_complet?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nom_complet?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
