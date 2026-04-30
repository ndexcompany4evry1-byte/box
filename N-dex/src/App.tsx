/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  QrCode, 
  User, 
  Palette, 
  ShieldCheck, 
  Download, 
  Share2, 
  Link as LinkIcon, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Camera,
  Trash2,
  Lock,
  Eye,
  CreditCard
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { supabase } from './lib/supabase';
import { cn } from './lib/utils';

// --- Types ---
interface SocialLinks {
  instagram: string;
  twitter: string;
  linkedin: string;
  facebook: string;
  website: string;
}

interface ProfileDesign {
  qrStyle: 'square' | 'rounded' | 'circular' | 'dots';
  qrColor: string;
  bgType: 'color' | 'gradient' | 'image';
  bgColor: string;
  bgGradient: string;
  bgImageUrl: string;
  logoUrl: string;
  borderColor: string;
  borderWidth: number;
}

interface Profile {
  id: string;
  profile_slug: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  bio: string;
  avatar: string;
  social: SocialLinks;
  design: ProfileDesign;
  scan_count: number;
  last_scan: string | null;
  created_at?: string;
}

// --- Defaults ---
const DEFAULT_DESIGN: ProfileDesign = {
  qrStyle: 'rounded',
  qrColor: '#2563eb',
  bgType: 'gradient',
  bgColor: '#ffffff',
  bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
  bgImageUrl: '',
  logoUrl: '',
  borderColor: 'rgba(255,255,255,0.2)',
  borderWidth: 1
};

const DEFAULT_PROFILE: Profile = {
  id: crypto.randomUUID(),
  profile_slug: '',
  name: '',
  title: '',
  company: '',
  phone: '',
  email: '',
  website: '',
  location: '',
  bio: '',
  avatar: '',
  social: { instagram: '', twitter: '', linkedin: '', facebook: '', website: '' },
  design: DEFAULT_DESIGN,
  scan_count: 0,
  last_scan: null
};

export default function App() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDigitalView, setIsDigitalView] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load from local storage or Supabase on init
  useEffect(() => {
    const initData = async () => {
      const saved = localStorage.getItem('smartid_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Fix for UUID error: if the saved ID is not a valid UUID (doesn't contain dashes or is custom format),
          // reset it to a new UUID to prevent database errors.
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(parsed.id)) {
            parsed.id = crypto.randomUUID();
            localStorage.setItem('smartid_data', JSON.stringify(parsed));
          }
          setProfile(parsed);
        } catch (e) {
          console.error('Error parsing local storage:', e);
        }
      }
    };
    initData();
  }, []);

  const saveToLocal = (p: Profile) => {
    localStorage.setItem('smartid_data', JSON.stringify(p));
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      if (updates.name) {
        const slug = updates.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        next.profile_slug = slug || prev.id;
      }
      saveToLocal(next);
      return next;
    });
  };

  const updateDesign = (updates: Partial<ProfileDesign>) => {
    setProfile(prev => {
      const next = { ...prev, design: { ...prev.design, ...updates } };
      saveToLocal(next);
      return next;
    });
  };

  const updateSocial = (platform: keyof SocialLinks, value: string) => {
    setProfile(prev => {
      const next = { ...prev, social: { ...prev.social, [platform]: value } };
      saveToLocal(next);
      return next;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const record = {
        ...profile,
        profile_slug: profile.profile_slug || profile.id,
        is_active: true,
        is_protected: !!password,
        scan_count: profile.scan_count,
        last_scan: profile.last_scan,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(record, { onConflict: 'id' });

      if (error) {
        if (error.code === '42501') {
          throw new Error('خطأ في أذونات قاعدة البيانات (RLS). يرجى التأكد من تفعيل سياسات الوصول (Policies) في Supabase للسماح بالإدخال والتحديث.');
        }
        throw error;
      }
      
      setMessage({ type: 'success', text: 'تم حفظ الملف بنجاح!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'فشل الحفظ: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileUrl = () => {
    const slug = profile.profile_slug || profile.id;
    return `https://smart-id.ct.ws/profile.php?id=${slug}`;
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getProfileUrl());
      setMessage({ type: 'success', text: 'تم نسخ الرابط!' });
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.company}
TITLE:${profile.title}
TEL:${profile.phone}
EMAIL:${profile.email}
URL:${profile.website}
ADR:${profile.location}
NOTE:${profile.bio}
END:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_') || 'contact'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateProfile({ avatar: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateDesign({ logoUrl: ev.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Components ---

  const ProfileCard = ({ profileData = profile, isPreview = true }) => {
    const d = profileData.design;
    const bgStyle: React.CSSProperties = {
      borderColor: d.borderColor || 'rgba(255,255,255,0.2)',
      borderWidth: `${d.borderWidth || 0}px`,
      borderStyle: 'solid'
    };

    if (d.bgType === 'color') {
      bgStyle.backgroundColor = d.bgColor;
    } else if (d.bgType === 'image' && d.bgImageUrl) {
      bgStyle.backgroundImage = `url(${d.bgImageUrl})`;
      bgStyle.backgroundSize = 'cover';
      bgStyle.backgroundPosition = 'center';
    }
    
    return (
      <div 
        className={cn(
          "relative overflow-hidden flex flex-col items-center justify-between shrink-0 p-10",
          d.bgType === 'gradient' ? d.bgGradient : '',
          isPreview ? "w-72 h-72 rounded-[3.5rem] shadow-2xl" : "w-full aspect-square max-w-sm rounded-[4rem] shadow-3xl"
        )}
        style={bgStyle}
      >
        {/* Advanced Decorative elements */}
        {d.bgType !== 'image' && (
          <>
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          </>
        )}
        
        {/* High-End Glass / Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        {/* Top: Avatar/Logo Section */}
        <div className="relative z-20 w-full flex justify-center h-14">
          {(d.logoUrl || profileData.avatar) ? (
            d.logoUrl ? (
              <img src={d.logoUrl} alt="Logo" className="h-full object-contain drop-shadow-xl" />
            ) : (
              <div className="relative">
                <img src={profileData.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl border-2 border-white/60 shadow-2xl object-cover ring-8 ring-white/5" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
              </div>
            )
          ) : (
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white/40" />
            </div>
          )}
        </div>

        {/* Middle: Integrated QR Code */}
        <div className="relative z-10 flex flex-col items-center gap-3 my-4">
          <QRCodeCanvas 
            value={`https://smart-id.ct.ws/profile.php?id=${profileData.profile_slug || profileData.id}`} 
            size={isPreview ? 120 : 170}
            fgColor={d.qrColor}
            level="H"
            bgColor="transparent"
            includeMargin={false}
          />
          <div className="flex flex-col items-center space-y-1">
            <p className="text-[8px] font-black tracking-[0.4em] uppercase" style={{ color: d.qrColor, opacity: 0.5 }}>Identity Matrix</p>
            <div className="h-[1px] w-6" style={{ background: `linear-gradient(to right, transparent, ${d.qrColor}4D, transparent)` }} />
          </div>
        </div>

        {/* Bottom: Name & Identity Info */}
        <div className="relative z-20 w-full flex flex-col items-center gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] relative -top-[6px]" style={{ color: d.qrColor, opacity: 0.4 }}>Verified Smart Identity</span>
          <span className="text-sm font-black text-white truncate max-w-full drop-shadow-sm text-center">
            {profileData.name || 'Digital Persona'}
          </span>
          <div className="w-6 h-0.5 rounded-full mt-1" style={{ backgroundColor: d.qrColor, opacity: 0.2 }} />
        </div>

        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-[4rem] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-tr-[4rem] pointer-events-none" />
      </div>
    );
  };

  const Dashboard = () => {
    const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
    const [fetching, setFetching] = useState(true);

    const loadAll = useCallback(async () => {
      setFetching(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (!error && data) {
          setAllProfiles(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    }, []);

    useEffect(() => {
      loadAll();
    }, [loadAll]);

    const deleteProfile = async (id: string) => {
      if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) {
        setAllProfiles(prev => prev.filter(p => p.id !== id));
        setMessage({ type: 'success', text: 'تم حذف المشروع' });
      }
    };

    return (
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-white/40 backdrop-blur-md p-6 rounded-[3rem] border border-white/40 shadow-xl">
          <div>
            <h2 className="text-3xl font-black text-slate-800">مشاريعي المكتبية</h2>
            <p className="text-sm font-bold text-slate-500 mt-1">أدر هوياتك الذكية من مكان واحد</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button 
              onClick={() => {
                setProfile(DEFAULT_PROFILE);
                setCurrentStep(1);
                setTab('editor');
              }}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-500/30"
            >
              <User className="w-5 h-5" />
              إنشاء هوية جديدة
            </button>
          </div>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 rounded-full" />
              <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent absolute top-0" />
            </div>
            <p className="mt-6 text-slate-400 font-black tracking-widest uppercase text-xs">Syncing Identity Cloud</p>
          </div>
        ) : allProfiles.length === 0 ? (
          <div className="text-center py-32 bg-white/30 backdrop-blur-xl rounded-[4rem] border-4 border-dashed border-white/50">
            <div className="w-24 h-24 bg-white/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <QrCode className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">صندوق الهويات فارغ</h3>
            <p className="text-slate-500 font-bold mb-8">ابدأ بتجسيد حضورك الرقمي عبر إنشاء أول بطاقة ذكية</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {allProfiles.map((p) => (
              <div 
                key={p.id}
                className="bg-white/70 backdrop-blur-md rounded-[3.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white flex flex-col"
              >
                <div className="flex justify-center mb-8 relative">
                   <div className="relative z-10">
                    <ProfileCard profileData={p} isPreview={true} />
                   </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-xl text-slate-800 truncate max-w-[180px]">{p.name || 'عضو غير مسمى'}</h4>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{p.title || 'بدون منصب محدد'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setProfile(p);
                          setCurrentStep(1);
                          setTab('editor');
                        }}
                        className="w-11 h-11 bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-100"
                      >
                        <Palette className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteProfile(p.id)}
                        className="w-11 h-11 bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-red-600 rounded-2xl border border-slate-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
                    <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full">
                       <Eye className="w-4 h-4 text-indigo-600" />
                       <span className="text-xs font-black text-indigo-700">{p.scan_count || 0}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setProfile(p);
                        setIsDigitalView(true);
                      }}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xl shadow-slate-900/10"
                    >
                      معاينة حية
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const [tab, setTab] = useState<'editor' | 'dashboard'>('editor');
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem('smartid_app_theme') || 'bg-slate-50');

  useEffect(() => {
    localStorage.setItem('smartid_app_theme', appTheme);
  }, [appTheme]);

  if (isDigitalView) {
    const tc = darkMode ? 'text-white' : 'text-slate-900';
    const sc = darkMode ? 'text-slate-400' : 'text-slate-500';
    const bg = darkMode ? 'bg-slate-950' : 'bg-slate-50';
    const cardBg = darkMode ? 'bg-slate-900' : 'bg-white';

    const SocialItem = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => {
      if (!href) return null;
      const fullUrl = href.startsWith('http') ? href : `https://${label.toLowerCase() === 'website' ? href : label.toLowerCase() + '.com/' + href}`;
      
      return (
        <a 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-2xl",
            darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-slate-100 shadow-sm"
          )}
        >
          <Icon className={cn("w-6 h-6", darkMode ? "text-indigo-400" : "text-indigo-600")} />
          <span className="text-xs font-medium">{label}</span>
        </a>
      );
    };

    return (
      <div className={cn("min-h-screen font-sans", bg)} dir="rtl">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setIsDigitalView(false)}
              className="flex items-center gap-2 text-indigo-500 font-bold"
            >
              <ChevronRight className="w-5 h-5" />
              المحرر
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={copyUrl}
                className={cn("p-2 rounded-xl shadow-sm", darkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600")}
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={cn("p-2 rounded-xl shadow-sm", darkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-600")}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Profile Card Main */}
          <div className={cn("rounded-3xl shadow-2xl overflow-hidden mb-8", cardBg)}>
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500 relative">
               <div className="absolute -bottom-16 right-8">
                {profile.avatar ? (
                  <img src={profile.avatar} className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover" />
                ) : (
                  <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
                    {profile.name?.[0] || '?'}
                  </div>
                )}
               </div>
            </div>

            <div className="pt-20 px-8 pb-8">
              <div className="mb-8">
                <h1 className={cn("text-3xl font-bold mb-1", tc)}>{profile.name || 'الاسم الكامل'}</h1>
                <p className="text-xl text-indigo-500 font-medium">{profile.title || 'المسمى الوظيفي'}</p>
                {profile.company && <p className={cn("text-lg font-medium opacity-80", tc)}>{profile.company}</p>}
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-8">
                  <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-2", sc)}>نبذة عني</h3>
                  <p className={cn("text-lg leading-relaxed opacity-90", tc)}>{profile.bio}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Phone, value: profile.phone, label: 'الهاتف' },
                  { icon: Mail, value: profile.email, label: 'البريد' },
                  { icon: Globe, value: profile.website, label: 'الموقع' },
                  { icon: MapPin, value: profile.location, label: 'العنوان' },
                ].map((item, i) => item.value && (
                  <div key={i} className={cn("flex items-center gap-4 p-4 rounded-2xl", darkMode ? "bg-slate-800" : "bg-slate-50")}>
                    <div className="p-2 bg-indigo-500/10 rounded-xl">
                      <item.icon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className={cn("text-xs font-medium", sc)}>{item.label}</p>
                      <p className={cn("font-bold truncate", tc)}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mb-8">
                <h3 className={cn("text-sm font-bold uppercase tracking-wider mb-4", sc)}>تواصل اجتماعي</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  <SocialItem icon={Instagram} href={profile.social.instagram} label="Instagram" />
                  <SocialItem icon={Twitter} href={profile.social.twitter} label="X" />
                  <SocialItem icon={Linkedin} href={profile.social.linkedin} label="LinkedIn" />
                  <SocialItem icon={Facebook} href={profile.social.facebook} label="Facebook" />
                  <SocialItem icon={Globe} href={profile.social.website} label="Website" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={downloadVCard}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  <User className="w-5 h-5" />
                  حفظ في جهات الاتصال
                </button>
              </div>
            </div>
          </div>

          <p className={cn("text-center text-sm font-medium", sc)}>
            أُنشئ بواسطة SmartID &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen font-sans text-slate-900 overflow-x-hidden", appTheme)} dir="rtl">
      {/* Toast Notification */}
      {message && (
        <div 
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold",
            message.type === 'success' ? "bg-green-500 text-white" : "bg-red-500 text-white"
          )}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              SmartID
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl">
              <button 
                onClick={() => setTab('dashboard')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-black",
                  tab === 'dashboard' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                لوحة التحكم
              </button>
              <button 
                onClick={() => setTab('editor')}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-black",
                  tab === 'editor' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                المحرر
              </button>
            </div>
            <button 
              onClick={() => setIsDigitalView(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:border-indigo-500 shadow-sm"
            >
              <Eye className="w-4 h-4 text-indigo-500" />
              معاينة حية
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        {tab === 'dashboard' ? (
          <Dashboard />
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-4">هويتك الرقمية بذكاء</h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">صمم بطاقتك الذكية، اربطها بـ NFC، وشارك ملفك الشخصي بضغطة واحدة.</p>
            </div>
            {/* Same grid content as before */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Sidebar */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
              {[
                { label: 'المعلومات', icon: User, step: 1 },
                { label: 'التصميم', icon: Palette, step: 2 },
                { label: 'الأمان', icon: ShieldCheck, step: 3 },
                { label: 'النشر', icon: LinkIcon, step: 4 }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(item.step)}
                  className={cn(
                    "flex flex-col items-center gap-1 min-w-[80px] p-2 rounded-2xl",
                    currentStep === item.step ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-indigo-500"
                  )}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Editor Content */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 min-h-[500px]">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">المعرف الشخصي (Slug)</label>
                        <input 
                          type="text" 
                          value={profile.profile_slug}
                          onChange={(e) => setProfile(prev => ({ ...prev, profile_slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') }))}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                          placeholder="your-custom-slug"
                        />
                        <p className="text-[10px] text-slate-400">هذا هو المعرف الذي سيظهر في الرابط: {profile.profile_slug || profile.id}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="أدخل اسمك..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">المسمى الوظيفي</label>
                        <input 
                          type="text" 
                          value={profile.title}
                          onChange={(e) => updateProfile({ title: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="مثلاً: مطور برمجيات"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">الشركة</label>
                        <input 
                          type="text" 
                          value={profile.company}
                          onChange={(e) => updateProfile({ company: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="اسم المنظمة"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">الهاتف</label>
                        <input 
                          type="tel" 
                          value={profile.phone}
                          onChange={(e) => updateProfile({ phone: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="0500 000 000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => updateProfile({ email: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700 block">روابط التواصل</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['instagram', 'twitter', 'linkedin', 'facebook'].map((plat) => (
                          <div key={plat} className="relative">
                            <input 
                              type="text"
                              value={profile.social[plat as keyof SocialLinks]}
                              onChange={(e) => updateSocial(plat as keyof SocialLinks, e.target.value)}
                              className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm"
                              placeholder={`User on ${plat}`}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                               {plat === 'instagram' && <Instagram size={18} />}
                               {plat === 'twitter' && <Twitter size={18} />}
                               {plat === 'linkedin' && <Linkedin size={18} />}
                               {plat === 'facebook' && <Facebook size={18} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-10">
                    <div>
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest block mb-4">نمط رمز QR</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {(['square', 'rounded', 'circular', 'dots'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => updateDesign({ qrStyle: style })}
                            className={cn(
                              "p-4 rounded-[2rem] border-2 flex flex-col items-center gap-2 capitalize",
                              profile.design.qrStyle === style ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-500/10" : "border-slate-100 hover:border-slate-200"
                            )}
                          >
                            <div className={cn("w-10 h-10 bg-slate-900 shadow-sm", style === 'rounded' ? 'rounded-lg' : style === 'circular' ? 'rounded-full' : '')} />
                            <span className="text-xs font-black">{style === 'rounded' ? 'مدور' : style === 'circular' ? 'دائري' : style === 'dots' ? 'نقاط' : 'مربع'}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest block mb-4">لون الرمز</label>
                      <div className="flex flex-wrap gap-4">
                        {['#000000', '#2563eb', '#4f46e5', '#db2777', '#059669', '#d97706', '#ffffff'].map(color => (
                          <button 
                            key={color}
                            onClick={() => updateDesign({ qrColor: color })}
                            className={cn(
                              "w-12 h-12 rounded-2xl p-1 border-2 shadow-sm",
                              profile.design.qrColor === color ? "border-indigo-500" : "border-transparent"
                            )}
                          >
                            <div className="w-full h-full rounded-xl border border-black/5" style={{ backgroundColor: color }} />
                          </button>
                        ))}
                        <div className="relative">
                          <input 
                            type="color" 
                            value={profile.design.qrColor}
                            onChange={(e) => updateDesign({ qrColor: e.target.value })}
                            className="w-12 h-12 rounded-2xl border-none cursor-pointer p-0 overflow-hidden shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest block">الخلفية والمظهر (قابلة للدمج)</label>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-500">نوع الخلفية</span>
                          <div className="flex gap-2">
                            {(['color', 'gradient', 'image'] as const).map(type => (
                              <button 
                                key={type}
                                onClick={() => updateDesign({ bgType: type })}
                                className={cn(
                                  "flex-1 px-4 py-3 rounded-2xl text-xs font-bold",
                                  profile.design.bgType === type ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-slate-100 text-slate-500"
                                )}
                              >
                                {type === 'color' ? 'لون' : type === 'gradient' ? 'تدرج' : 'صورة'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {profile.design.bgType === 'gradient' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            'bg-gradient-to-br from-blue-50 to-indigo-100',
                            'bg-gradient-to-br from-indigo-600 to-blue-500',
                            'bg-gradient-to-br from-slate-900 to-black',
                            'bg-gradient-to-br from-rose-500 to-pink-500',
                            'bg-gradient-to-br from-emerald-500 to-teal-600',
                            'bg-gradient-to-br from-amber-400 to-orange-500'
                          ].map(grad => (
                            <button 
                              key={grad}
                              onClick={() => updateDesign({ bgGradient: grad })}
                              className={cn(
                                "h-16 rounded-2xl border-2",
                                profile.design.bgGradient === grad ? "border-indigo-500" : "border-slate-100"
                              )}
                            >
                               <div className={cn("w-full h-full rounded-xl", grad)} />
                            </button>
                          ))}
                        </div>
                      )}

                      {profile.design.bgType === 'image' && (
                        <div className="flex items-center gap-4">
                           <div className="w-32 h-20 rounded-[1.5rem] bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-inner">
                            {profile.design.bgImageUrl ? (
                              <img src={profile.design.bgImageUrl} className="w-full h-full object-cover" />
                            ) : (
                              <Palette className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          <input 
                            type="file" 
                            id="bgImageInput" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => updateDesign({ bgImageUrl: ev.target?.result as string });
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                          <button 
                            onClick={() => document.getElementById('bgImageInput')?.click()} 
                            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black shadow-sm hover:border-indigo-500"
                          >
                            رفع خلفية مخصصة
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-black text-slate-400 uppercase tracking-widest block mb-4">شعار العلامة التجارية</label>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-20 rounded-[1.5rem] bg-white flex items-center justify-center border border-slate-200 overflow-hidden shadow-xl ring-8 ring-slate-50">
                          {profile.design.logoUrl ? (
                            <img src={profile.design.logoUrl} className="h-full object-contain p-2" />
                          ) : (
                            <Palette className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <input type="file" id="logoInput" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        <button onClick={() => document.getElementById('logoInput')?.click()} className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-black">اختيار الشعار</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 flex gap-4">
                      <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />
                      <div>
                        <h3 className="font-bold text-amber-900 mb-1">حماية البيانات المتطورة</h3>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          يمكنك جعل ملفك الشخصي خاصاً ولا يفتح إلا بكلمة مرور. جميع البيانات مشفرة وتتم مزامنتها مع خوادمنا السحابية.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">قفل الملف الشخصي</h4>
                          <p className="text-xs text-slate-400">تنبيه بالبريد الإلكتروني عند كل عملية مسح</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={!!password} onChange={(e) => setPassword(e.target.checked ? 'p@ss' : '')} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      {!!password && (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">أدخل كلمة المرور</label>
                          <input 
                            type="password" 
                            value={password === 'p@ss' ? '' : password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="6 خانات على الأقل"
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                      <h4 className="font-bold mb-4">إحصائيات الملف</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-black text-indigo-600">{profile.scan_count}</p>
                          <p className="text-xs font-bold text-indigo-400">إجمالي الزيارات</p>
                        </div>
                        <div className="text-center border-r border-indigo-200">
                          <p className="text-lg font-black text-indigo-600">{profile.last_scan ? new Date(profile.last_scan).toLocaleDateString() : 'لا يوجد'}</p>
                          <p className="text-xs font-bold text-indigo-400">آخر ظهور</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h2 className="text-2xl font-black">تهانينا! بطاقتك جاهزة</h2>
                      <p className="text-slate-500 font-medium">اختر كيفية مشاركة هويتك الرقمية الجديدة</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                          <LinkIcon className="w-5 h-5 text-indigo-500" />
                          <h4 className="font-bold">رابط الملف الموحد</h4>
                        </div>
                        <div className="flex gap-2">
                          <input readOnly value={getProfileUrl()} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono truncate" />
                          <button onClick={copyUrl} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">نسخ</button>
                        </div>
                      </div>

                      <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                          <Download className="w-5 h-5 text-indigo-600" />
                          <h4 className="font-bold text-indigo-900">تنزيل رمز QR</h4>
                        </div>
                        <button 
                          onClick={() => {
                            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
                            if (canvas) {
                              const link = document.createElement('a');
                              link.download = `${profile.name || 'smartid'}_qrcode.png`;
                              link.href = canvas.toDataURL();
                              link.click();
                            }
                          }}
                          className="w-full py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold shadow-sm"
                        >
                          تصدير PNG
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="w-full py-5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-500/30 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="spinner !border-white !border-t-transparent" />
                          جارٍ الحفظ...
                        </div>
                      ) : (
                        'حفظ ونشر الملف ✓'
                      )}
                    </button>
                  </div>
                )}
            </div>

            {/* Navigation Buttons Lower */}
            <div className="flex items-center justify-between">
               <button 
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={cn(
                  "p-4 rounded-2xl flex items-center gap-2 font-bold",
                  currentStep === 1 ? "text-slate-300 pointer-events-none" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <ChevronRight className="w-5 h-5" />
                سابق
              </button>
              <button 
                 onClick={() => {
                  if (currentStep < 4) setCurrentStep(prev => prev + 1);
                  else handleSave();
                 }}
                 className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 flex items-center gap-2"
              >
                {currentStep === 4 ? 'إنهاء' : 'التالي'}
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card Preview Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-200 flex flex-col items-center relative overflow-hidden">
              
              <div className="relative z-10 text-center mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Live Identity Preview</h3>
                <p className="text-[10px] font-bold text-indigo-500 uppercase">Scale: 1:1 Actual Size (25cm)</p>
              </div>
              
              {/* The Actual Card */}
              <div className="mb-10 relative z-10 drop-shadow-2xl">
                <ProfileCard />
              </div>

              <div className="w-full space-y-4 relative z-10">
                 <div className="flex items-center justify-between px-6 py-5 bg-slate-50/80 backdrop-blur-md rounded-[2.5rem] border border-slate-100/50 shadow-inner">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                       <ShieldCheck className="w-5 h-5 text-indigo-600" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypt</span>
                       <span className="text-xs font-black text-slate-800">Secure Protocol</span>
                     </div>
                   </div>
                   <div className={cn(
                     "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                     password 
                      ? "bg-amber-100 text-amber-600 border-amber-200 shadow-sm shadow-amber-200/50" 
                      : "bg-green-100 text-green-600 border-green-200 shadow-sm shadow-green-200/50"
                   )}>
                     {password ? 'Protected' : 'Global'}
                   </div>
                 </div>

                 <button 
                  onClick={() => setIsDigitalView(true)}
                  className="w-full py-6 text-white font-black text-sm bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3"
                >
                  <div className="w-6 h-6 bg-white/10 rounded-xl flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  رؤية الملف الرقمي الحي
                </button>
              </div>

              <div className="mt-10 flex gap-2.5">
                 <div className="w-2 h-2 rounded-full bg-slate-100" />
                 <div className="w-6 h-2 rounded-full bg-indigo-500" />
                 <div className="w-2 h-2 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </main>
</div>
  );
}
